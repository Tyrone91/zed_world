import * as Loot from "./loot-system/loot-system.js"

function main(){
    console.log("main");
    window.table = new Loot.LootTable();
}
window.addEventListener("load", main);
