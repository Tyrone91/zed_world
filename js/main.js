import { LootTable, LootObject, LootHander } from "./loot-system/loot-system.js";
import { Table } from "./math/table.js";
import { MissionParameters } from "./mission/mission-parameters.js";
import { GameConstants } from "./core/game-constants.js";
import { Team } from "./mission/team.js";
import { Survivor } from "./core/character/survivor.js";
import { SurvivorMission } from "./mission/survivor-mission.js";
import { TemplateLoader } from "./loader/template-loader.js";
import { LootTableLoader } from "./loader/loot-table-loader.js";
import { ItemResolver } from "./loader/item-resolver.js";



//Please delete this mess
//window.GameContext = new GameContext();
//initDebugWorld();
window.addEventListener("load", main);

/**
 * 
 * @param {LootObject} lootObject 
 */
function receiveLoot(lootObject){
    console.log(`loot found: ${lootObject.name}`);
}

function main(){
    /*
    const handler = new LootHander();
    const lootTable = new LootTable( (handler.reveiceLoot.bind(handler)) );

    const loot = [
        new LootObject(receiveLoot, "string",false,"Test Mk1", "TestObject for my new Implementation"),
        new LootObject(receiveLoot, "string",false,"Test Mk2", "TestObject for my new Implementation"),
        new LootObject(receiveLoot, "string",false,"Test Mk3", "TestObject for my new Implementation"),
    ];
    loot.forEach( loot => lootTable.add(loot, 50) );
    window.loottable = lootTable;
    window.handler = handler;

    lootTable
    .roll()
    .roll()
    .roll();
    */
   
    const t1 = new Table(4,10);
    const t2 = new Table(4,10);

    window.Table = Table;
    window.t1 = t1;
    window.t2 = t2;
    window.Parameters = MissionParameters;
    window.Constants = GameConstants;

    const team1 = new Team();
    const surv1 = new Survivor();
    const surv2 = new Survivor();

    team1.addTeamMember(surv1, surv2);

    const mission = new SurvivorMission();
    mission.addTeam(team1);

    window.mission = mission;
    window.team = team1;
    window.surv1 = surv1;
    window.surv2 = surv2;

    /*
    const loader = new TemplateLoader("data/items/", "_templates.json");
    console.log("loader");
    //loader.load().then( (list) => console.log(list) );
    
    const tableLoader = new LootTableLoader("data/items/", "_loot-tables.json");
    tableLoader.load().then( () => {
        console.log("TableCreation");
        const t = tableLoader.createTable("generic-table");
        console.log(t);
        t._printChances();
    });
    */
}

