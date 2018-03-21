import { LootTable, LootObject, LootHander } from "./loot-system/loot-system.js";

initDebugWorld();
window.addEventListener("load", main);

/**
 * 
 * @param {LootObject} lootObject 
 */
function receiveLoot(lootObject){
    console.log(`loot found: ${lootObject.name}`);
}

function main(){
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
}