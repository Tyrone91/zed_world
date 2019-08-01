import { BaseLoot } from "./base-loot.js";
import { LootCollector } from "./loot-collector.js";
import { Resource } from "./resources.js";

export class LootWrapperResource extends BaseLoot {

    /**
     * 
     * @param {string} name 
     * @param {string} description 
     * @param {Resource} resources 
     */
    constructor(name, description, resources) {
        super(LootWrapperResource.Type, name, description);
        this._content = resources;
    }

    /**
     * 
     * @param {LootCollector} collector 
     */
    receive(collector) {
        collector.receiveResource(this);
    }

    get content() {
        return this._content;
    }
}

LootWrapperResource.Type = "LootWrapperResource";