import { ENVIRONMENT } from "./game-environment.js";
import { Survivor } from "./survivor.js";
import { MissionMap } from "../mission/mission-map.js";
import { Location } from "../mission/location.js";
import { MissionBuilder } from "../mission/mission-builder.js";
import { Team } from "../mission/team.js";
import { LootTable } from "../loot-system-v2/loot-table.js";
import { CreateFood, CreateMetal, CreateWood } from "../loot-system-v2/loot-create-resource.js";
import { SurvivorCamp } from "./survivor-camp.js";

const game = ENVIRONMENT;
window.DEBUG_GAME = game;

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
    team.addTeamMember( game.createRandomSurvivor("Random Team Member") );

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
    game.addSurvivor(
        new Survivor().name("Bob"),
        new Survivor().name("Francis"),
        new Survivor().name("Alex"),
        game.createRandomSurvivor("R1"),
        game.createRandomSurvivor("R2"),
        game.createRandomSurvivor("R3")
    );

    game._missionMap = new MissionMap(5,5, [
        {
            location: cityLocation(), x: 0, y: 0

        },
        {
            location: battleLocation(), x: 1, y: 0
        }
    ]);
    game.addNewMission(testMission());
    game.addNewMission(battleMission());
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

game.onready(setup);