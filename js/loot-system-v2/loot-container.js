import { LootWrapper } from "./loot-wrapper.js";
import { LootTable } from "./loot-table.js";

export class LootContainer extends LootWrapper {
    
    /**
     * 
     * @param {string} type 
     * @param {number} weight 
     * @param {string} contentDesc 
     * @param {...LootTable<LootWrapper>} content 
     */
    constructor(type, weight, contentDesc, ...content){
        super(type, weight, contentDesc, ...content);
    }

    open( rng = ( () => Math.random()) ){
        /**@type {LootTable<LootWrapper>[]} */
        const content = this._content;
        return content.map( table => table.roll(rng) );
    }

}