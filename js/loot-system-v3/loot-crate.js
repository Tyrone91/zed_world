import { BaseLoot } from "./base-loot.js";
import { LootCollector } from "./loot-collector.js";
import { LootTable } from "./loot-table.js";
import { Random } from "../math/random.js";

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

export class LootTableCrate extends LootCrate {

    /**
     * 
     * @param {string} name 
     * @param {string} description 
     * @param {LootTable} lootTable 
     * @param {Random} rng 
     */
    constructor(name, description, rollTimes, lootTable, rng) {
        super(name, description, () => {
            return lootTable
                .rollTimes(rollTimes, () => rng.next() )
                .map(wrapper => wrapper.content)
                .reduce( (prev,cur) => [...prev, ...cur],[]);
        });
    }
}
