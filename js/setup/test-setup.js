import { ENVIRONMENT } from "../core/game-environment.js";
import { Survivor } from "../core/character/survivor.js";
import { MissionMap } from "../mission/mission-map.js";
import { Location } from "../mission/location.js";
import { MissionBuilder } from "../mission/mission-builder.js";
import { Team } from "../mission/team.js";
import { LootTable } from "../loot-system-v2/loot-table.js";
import { CreateFood, CreateMetal, CreateWood } from "../loot-system-v2/loot-crate-resource.js";
import { SurvivorCamp } from "../core/survivor-camp.js";
import { Equipable } from "../equipment/equipable.js";
import * as Templates from "./setup-templates.js";
import { EquipmentHolder } from "../equipment/equipment-holder.js";

const game = ENVIRONMENT;
window.DEBUG_GAME = game;

/**
 * 
 * @param {string} name 
 */
function makeWeapon(name) {
    const eq = new Equipable(name,"Description of " + name, Equipable.Type.WEAPON, name + ".jpg");
    return eq;
}

function makeBody(name) {
    return new Equipable(name,"Description of " + name, Equipable.Type.BODY);
}

function weaponSetup() {
    game.getCamp().getArmory().addEquipment(
        makeWeapon("M4"),
        makeWeapon("AK47"),
        makeWeapon("MP5"),
        makeWeapon("P250")
    );

    game.getCamp().getArmory().addEquipment(
        game.getEquipmentGenerator().generate(Templates.templateAK()),
        game.getEquipmentGenerator().generate(Templates.templateM4()),
        game.getEquipmentGenerator().generate(Templates.templateMP5())
    );
}

function testLootTables(){

    const common = new LootTable(LootTable.Rarity.COMMON).setName("COMMON_LOOT_TABLE")
        .addWrapper(new CreateFood(10,200), new CreateMetal(10,100), new CreateWood(10, 150) );
    
    const rare = new LootTable(LootTable.Rarity.RARE).setName("RARE_LOOT_TABLE")
        .addWrapper(new CreateFood(10,400), new CreateMetal(10,200), new CreateWood(10, 300) )
        .addWrapper(new CreateFood(5, 600), new CreateMetal(5, 300), new CreateWood( 5, 400) );

    const extraordinary = new LootTable(LootTable.Rarity.EXTRAORDINARY).setName("EXTRAORDINARY_LOOT_TABLE")
        .addWrapper(new CreateFood(10,800), new CreateMetal(10,400), new CreateWood(10, 600) )
        .addWrapper(new CreateFood(5,1000), new CreateMetal(5, 750), new CreateWood( 5, 900) );

    return [common, rare, extraordinary];
}

function testMission(){
    const builder = game.createDefaultMissionBuilder();

    const team = new Team("Test Team Mission Bois");
    team.addTeamMember( game.characterCreator.createRandomCharacter("Random Team Member") );

    builder.setTeams([team]);
    builder.setTarget(game.getMissionMap().getPosition(0,0));
    return builder.build();
}

function battleMission() {
    const builder = game.createDefaultMissionBuilder();

    const team = new Team("Battle-Team");

    const surv = new Survivor();
    surv.name("Scapegoat");
    surv.health = 100;
    surv.combatstats.damage.min(5).max(10);
    surv.combatstats.actionsPerRound.base(1);
    surv.combatstats.optimalRange.min(5).max(25);

    team.addTeamMember(surv);

    builder.setTeams([team]);
    builder.setTarget(game.getMissionMap().getPosition(1,0));
    return builder.build();
}

function setup(){

    const surv1 = /**@type {Survivor} */ (new Survivor().name("Dev1"));
    surv1.equipment.unequipFrom(EquipmentHolder.Slot.MAIN_WEAPON);
    surv1.equipment.equip(game.getEquipmentGenerator().generate(Templates.templateAK()) );

    const surv2 = /**@type {Survivor} */ (new Survivor().name("Dev2"));
    surv2.equipment.unequipFrom(EquipmentHolder.Slot.MAIN_WEAPON);
    surv2.equipment.equip(game.getEquipmentGenerator().generate(Templates.templateM4()) );

    const surv3 = /**@type {Survivor} */ (new Survivor().name("Dev3"));
    surv3.equipment.unequipFrom(EquipmentHolder.Slot.MAIN_WEAPON);
    surv3.equipment.equip(game.getEquipmentGenerator().generate(Templates.templateMP5()) );

    game.addSurvivor(
        new Survivor().name("Bob"),
        new Survivor().name("Francis"),
        new Survivor().name("Alex"),
        game.characterCreator.createRandomCharacter("R1"),
        game.characterCreator.createRandomCharacter("R2"),
        game.characterCreator.createRandomCharacter("R3"),
        surv1,
        surv2,
        surv3
    );

    game._missionMap = new MissionMap(5,5, [
        {
            location: cityLocation(), x: 0, y: 0

        },
        {
            location: battleLocation(), x: 1, y: 0
        },
        {
            location: battleEasyLocation(), x: 2, y: 0
        }
    ]);
    game.addNewMission(testMission());
    game.addNewMission(battleMission());

    weaponSetup();
}

function cityLocation(){
    const location = new Location("City", "A former glorous City, turned into an undead buffet.").addLootTable(...testLootTables());
    location.modifiers.lootCommon.base(70);
    location.modifiers.lootRare.base(40);
    location.modifiers.lootExtraOrdinary.base(20);
    return location;
}

function battleLocation() {
    const loc = new Location("Battle", "DEBUG_LOCATION");
    loc.modifiers.encounterChance.min(100).base(100).max(100);
    loc.modifiers.zombies.min(25).base(50).max(75);
    loc.modifiers.range.min(30).base(60).max(70);
    
    return loc;
}

function battleEasyLocation() {
    const loc = new Location("Easy Battle", "DEBUG_LOCATION");
    loc.modifiers.encounterChance.min(100).base(100).max(100);
    loc.modifiers.zombies.min(5).base(5).max(5);
    loc.modifiers.range.min(70).base(70).max(70);

    loc.modifiers.lootCommon.base(100);
    loc.modifiers.lootRare.base(60);
    loc.modifiers.lootExtraOrdinary.base(30);

    loc.addLootTable(...testLootTables());
    
    return loc;
}

game.onready(setup);