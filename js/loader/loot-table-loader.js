import { ItemResolver } from "./item-resolver.js";
import  * as Ajax from "../util/ajax.js"
import { LootTable } from "../loot-system/loot-table.js";

class LootTableTempalteEntryItem {
    constructor(weight, itemRef){
        this.weight = weight;
        this.itemRef = itemRef;
    }
}

class LootTableTempalteEntryTable {
    constructor(weight, tableRef){
        this.weight = weight;
        this.tableRef = tableRef;
    }
}

class LootTableTemplate{
    constructor(){

        /**@type {string} */
        this.referenceId;

        /**@type {(LootTableTempalteEntryItem|LootTableTempalteEntryTable)[]} */
        this.drops = [];
    }
}

export class LootTableLoader {
    /**
     * 
     * @param {ItemResolver} resolver 
     * @param {string} basePath
     * @param {string} initFile
     */
    constructor(basePath, initFile){
        this._basePath = basePath;
        this._initFile = initFile;

        /**@type {LootTableTemplate[]} */
        this._templates = [];
    }

    _path(name){
        return this._basePath + name + ".json";
    }

    /**
     * @param {string[]} list
     * @returns {Promise<[LootTableTemplate]>}
     */
    _collectTables(list){
        return Ajax.getJSONAll(list, this._basePath + "tables/", ".json")
        .then( res => {
            res.missing.forEach( url => console.warn(`Couldn't resolve ${url} in ${this._initFile}`) );
            console.log(res);
            return res.data;
        });
    }

    _fetchList(){
        return Ajax.getJSON(this._basePath + this._initFile)
        .then(list => this._collectTables(list) )
        .then( data => {
            console.log(data);
            this._templates.push(...data);
            return data;
        });
    }

    load(){
        return this._fetchList();
    }

    createTable(name, ...onroll){
        const template = this._templates.find( t => t.referenceId === name) || null;
        if(!template){
            throw "LootTable creation error. " + name + " was not found";
        }
        const table = new LootTable(onroll);
        template.drops.forEach( entry => {
            if(entry.itemRef){
                table.add(entry.itemRef, entry.weight)
            }else if(entry.tableRef){
                table.add(this.createTable(entry.tableRef), entry.weight ); //TODO implement a way to have tables in tables
            }
        });
        return table;
    }

    getLootTableNames(){
        return this._templates.map( l => l.referenceId);
    }
}