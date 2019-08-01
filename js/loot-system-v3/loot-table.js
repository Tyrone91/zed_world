import { LootWrapper } from "./loot-wrapper.js";
import { BaseLoot } from "./base-loot.js";

/**
 * @template T
 */
export class LootTable {
    
    constructor(type = LootTable.Rarity.COMMON){
        /**@type LootWrapper[] */
        this._lootList = [];
        this._name = "COMMON_LOOT_TABLE";
        this._type = type;
    }

    get type(){
        return this._type;
    }

    setName(name){
        this._name = name;
        return this;
    }

    getName(){
        return this._name;
    }

    _calcTotalWeight(){
        return this._lootList.reduce( (total, container) => total + container.weight , 0);
    }

    /**
     * 
     * @param {BaseLoot} loot 
     * @param {number} weight 
     */
    addLoot(loot, weight = 1.0) {
        this._lootList.push(new LootWrapper(loot.type, weight, loot.description, loot));
        return this;
    }

    /**
     * 
     * @param {...LootWrapper} wrapper 
     */
    addWrapper(...wrapper){
        this._lootList.push(...wrapper);
        return this;
    }

    roll( rng = (() => Math.random()) ) {
        const totalWeight = this._calcTotalWeight();
        const hit = rng() * totalWeight;
        let offset = 0;
        for(const container of this._lootList){
            const containerRange = offset + container.weight;
            if( offset <= hit && (offset + container.weight) > hit){
                return container;
            }else{
                offset += container.weight;
            }
        }
        throw new Error("LootTable: IllegalState");
    }

    rollTimes(rolls = 1, rng = ( () => Math.random()) ) {
        const res = [];
        while(rolls--){
            res.push(this.roll(rng));
        }
        return res;
    }

    /**
     * @returns [{chance: number,loot: string}]
     */
    getChances(){
        const totalWeight = this._calcTotalWeight();
        return this._lootList.map( container => {
            return {
                chance: container.weight / totalWeight,
                desc: container.contentDescription,
                container: container
            };
        });
    }

    _printChances(){
        this.getChances().forEach( entry => console.log(entry.desc + ": " + (entry.chance*100).toFixed(2) + "%") );
        return this;
    }
}

export class LootTableID {

    /**
     * @param {string} id 
     */
    constructor(id) {
        this._id = id;
    }

    asString() {
        return this._id;
    }

    toString() {
        return `LootTableID[${this._id}]`;
    }

    /**
     * 
     * @param {LootTableID} id 
     */
    isEqualTo(id) {
        return id._id == this._id;
    }



    static of(id) {
        return new LootTableID(id);
    }
}

LootTable.Rarity = {
    COMMON: "COMMON",
    RARE: "RARE",
    EXTRAORDINARY: "EXTRAORDINARY"

}