import { LootWrapper } from "./loot-wrapper.js";

export class LootCrate extends LootWrapper {

    constructor(weight = 1, ...content) {
        super(LootCrate.Type,weight, LootCrate.DESC_KEY, ...content);
    }
}

LootCrate.Type = "LootCrate";
LootCrate.DESC_KEY = "LOOT_CRATE_TRANSLATION_KEY";