import { LootTable, LootTableID } from "./loot-table.js";

export class AlreadyRegisteredError extends Error {

    /**
     * 
     * @param {LootTableID} id 
     */
    constructor(id) {
        super(`There is already a table with :'${id}'`);
    }
}

export class NoLootTableFoundError extends Error {

    /**
     * 
     * @param {LootTableID} id 
     */
    constructor(id) {
        super(`There is no table with '${id.asString()}' as id registered`);
    }
}

export class LootTableService {

    constructor() {
        this._default = null;

        /**@type {Map<string,LootTable>} */
        this._tables = new Map();
    }

    /**
     * 
     * @param {LootTable} table 
     */
    setDefaultLootTable(table) {
        this._default = table;
    }

    /**
     * 
     * @param {LootTableID} id 
     * @param {LootTable} table 
     */
    register(id, table) {
        if(this._tables.has(id.asString())) {
            throw new AlreadyRegisteredError(id);
        }
        this._tables.set(id.asString(), table);
        return this;
    }

    /**
     * 
     * @param {LootTableID} id 
     */
    unregister(id) {
        this._tables.delete(id.asString());
        return this;
    }

    /**
     * 
     * @param {LootTableID} id 
     * @param {boolean} fallback 
     */
    find(id, fallback = true) {
        const res = this._tables.get(id.asString());
        if(!res && (!fallback || !this._default)) {
            throw new NoLootTableFoundError(id);
        }
        return res;
    }

    load() {
        throw "Not yet implemented"; //TODO: load loot table definition from JSON
    }

    get tables() {
        return [...this._tables.entries()].map( e => e[1]);
    }
}