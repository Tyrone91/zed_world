export class LootContainer {
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

    static Type = {
        FOOD : "FODD",
        AMMO : "AMMO",
        EQUIPMENT: "EQUIPMENT"
    }
}