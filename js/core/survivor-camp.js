import { ResourceFood, ResourceWood, ResourceMetal } from "../loot-system/resources.js";
import { AmmoTable } from "../loot-system/ammo-table.js";

export class SurvivorCamp {
    constructor(){
        this._foodStock = new ResourceFood();
        this._woodStock = new ResourceWood();
        this._metalStock = new ResourceMetal();
        this._ammoStock = new AmmoTable();
        this._survivorLimit = 5;
    }

    getFoodStock(){
        return this._foodStock;
    }

    getWoodStock(){
        return this._woodStock;
    }

    getMetalStock(){
        return this._metalStock;
    }

    getAmmoStock(){
        return this._ammoStock;
    }

    getSurvivorLimit(){
        return this._survivorLimit;
    }

    setSurvivorLimit(val){
        this._survivorLimit = val;
        return this;
    }


}