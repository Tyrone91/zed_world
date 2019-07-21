import { LootTableService } from "../loot-system-v2/loot-table-service.js";

export class Services {

    constructor() {
        this._lootTableService = new LootTableService();
    }

    get lootTableService() {
        return this._lootTableService;
    }
}