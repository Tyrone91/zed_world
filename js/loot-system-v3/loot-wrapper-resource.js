import { BaseLoot } from "./base-loot.js";
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


    receive(collector) { // I CAN NOT ADD A REFERENCE HERE BECAUSE THAT WOULD LEAD TO AN CIRCULAR IMPORT.
        collector.receiveResource(this);
    }

    get content() {
        return this._content;
    }
}

LootWrapperResource.Type = "LootWrapperResource";