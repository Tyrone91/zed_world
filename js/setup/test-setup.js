import { ENVIRONMENT } from "../core/game-environment.js";
import { Survivor } from "../core/character/survivor.js";
import { MissionMap } from "../mission/mission-map.js";
import { Location } from "../mission/location.js";
import { MissionBuilder } from "../mission/mission-builder.js";
import { Team } from "../mission/team.js";
import { LootTable } from "../loot-system-v3/loot-table.js";
import { SurvivorCamp } from "../core/survivor-camp.js";
import { Equipable } from "../equipment/equipable.js";
import * as Templates from "./setup-templates.js";
import { EquipmentHolder } from "../equipment/equipment-holder.js";
import { LootWrapperResource } from "../loot-system-v3/loot-wrapper-resource.js";
import { ResourceWood, ResourceFood, ResourceMetal } from "../loot-system-v3/resources.js";

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

function lootFood(number, name = "FOOD_RESOURCE_TITLE", desc = "FOOD_RESOURCE_CRATE_DESC") {
    return new LootWrapperResource(name, desc, new ResourceFood(number));
}

function lootMetal(number, name = "METAL_RESOURCE_TITLE", desc = "METAL_RESOURCE_CRATE_DESC") {
    return new LootWrapperResource(name, desc, new ResourceMetal(number));
}

function lootWood(number = 100, name = "WOOD_RESOURCE_TITLE", desc = "WOOD_RESOURCE_CRATE_DESC") {
    return new LootWrapperResource(name, desc, new ResourceWood(number));
}

function testLootTables(){

    const common = new LootTable(LootTable.Rarity.COMMON).setName("COMMON_LOOT_TABLE")
        .addLoot(lootFood(200), 10)
        .addLoot(lootWood(150), 10)
        .addLoot(lootMetal(100), 10);
    
    const rare = new LootTable(LootTable.Rarity.RARE).setName("RARE_LOOT_TABLE")
        .addLoot(lootFood(400), 10)
        .addLoot(lootWood(300), 10)
        .addLoot(lootMetal(200), 10)

        .addLoot(lootFood(600), 5)
        .addLoot(lootWood(400), 5)
        .addLoot(lootMetal(300), 5);

    const extraordinary = new LootTable(LootTable.Rarity.EXTRAORDINARY).setName("EXTRAORDINARY_LOOT_TABLE")
        .addLoot(lootFood(800), 10)
        .addLoot(lootWood(600), 10)
        .addLoot(lootMetal(400), 10)

        .addLoot(lootFood(1000), 5)
        .addLoot(lootWood(900), 5)
        .addLoot(lootMetal(750), 5);

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