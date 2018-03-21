import { LootObject } from "./loot-object.js";

export class LootObjectNotFoundError extends Error{
    /**
     * 
     * @param {LootObject} loot 
     */
    constructor(loot){
        super(`The given loot-object (${loot.name}) was not found`);
    }
}

export class LootHander{
    constructor(){
        /**@type [LootObject] */
        this._unopened = [];
        this._newUnopenedListeners = [];
    }

    get unopened(){
        return this._unopened;
    }

    /**
     * @param {LootObject} loot 
     */
    reveiceLoot(loot){
        if(loot.autoOpen){
            loot.open();
        }else{
            this._unopened.push(loot);
            this._newUnopenedListeners.forEach( l => l(this,loot) );
        }
    }

    openAll(){
        for(let i = this._unopened.length-1; i >= 0; --i){
            this.open(this._unopened[i]);
        }
        return this;
    }

    /**
     * Open the loot object.
     * If the given Object is not inside the unopened list an error will be thrown.
     * @param {LootObject} object
     * @throws {LootObjectNotFoundError}
     */
    open(object){
        const index = this._unopened.indexOf(object);
        if(index === -1){
            throw new LootObjectNotFoundError(object);
        }
        this._unopened.splice(index,1);
        object.open();
        return this;
    }

    /**
     * @param {function} listener Add a new callback that will be called each time a new item is added to the unopened list. Receives this object and the new item
     */
    addUnopenedListener(listener){
        this._newUnopenedListeners.push(listener);
        return this;
    }
}