export class LootContainer {
    
    /**
     * 
     * @param {string} type 
     * @param {function():any} lootBuilder 
     */
    constructor(type, lootBuilder){
        this._type = type;
        this._lootBuilder = lootBuilder;
    }

    get type(){
        return this._type;
    }
    

    get loot(){
        return this._lootBuilder();
    }
    
}