import { MissionParameters } from "./mission-parameters.js";
import { LootTable } from "../loot-system-v2/loot-table.js";
import { LootWrapper } from "../loot-system-v2/loot-wrapper.js";

export class Location{

    constructor(name = "", description = ""){
        this._name = name;
        this._description = description;
        this._modifiers = new MissionParameters().fill(1);

        /**@type {LootTable<LootWrapper>[]} */
        this._lootTables = [];
    }

    get name(){
        return this._name;
    }

    get description(){
        return this._description
    }

    get modifiers(){
        return this._modifiers;
    }

    setName(newName){
        this._name = newName;
        return this;
    }

    setDescription(desc){
        this._description = desc;
        return this;
    }

    addLootTable(...table){
        this._lootTables.push(...table);
        return this;
    }

    getLootTables(){
        return this._lootTables;
    }
}


