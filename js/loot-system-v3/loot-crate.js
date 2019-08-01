import { BaseLoot } from "./base-loot.js";
import { LootCollector } from "./loot-collector.js";

export class LootCrate extends BaseLoot {

    /**
     *                                          
     * @param {string} name 
     * @param {string} description 
     * @param {() => BaseLoot[]} onOpen
     */
    constructor(name = "NO_NAME_CRATE", description = "NO_DESCRIPTION_CRATE", onOpen = () => []) {
        super(name, description);
        this._onOpen = onOpen;
    }

    /**
     * 
     * @param {LootCollector} collector 
     */
    receive(collector) {
        collector.receiveCrate(this);
    }

    onopen(callback) {
        this._onOpen = callback;
        return this;
    }

    open() {
        return this._onOpen();
    }
}

export class FixedContentLootCrate extends LootCrate {

    /**
     *      
     * @param {string} name 
     * @param {string} description 
     * @param  {...BaseLoot} content 
     */
    constructor(name, description, ...content) {
        super(name, description, () => {
            return content;
        });
    }

    /**
     * THIS METHOD WILL THROW AN ERROR IF CALLED. 
     * @param {any} any
     * @returns {undefined} 
     */
    onopen(any) {
        throw "This method is not allowed for the FixedContentLootCrate";
    }
}
