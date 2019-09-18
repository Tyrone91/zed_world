import { LootTableService } from "../loot-system-v3/loot-table-service.js";

export class Services {

    constructor() {
        this._lootTableService = new LootTableService();
    }

    get lootTableService() {
        return this._lootTableService;
    }
}