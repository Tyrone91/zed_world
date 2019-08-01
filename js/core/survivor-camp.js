import { ResourceFood, ResourceWood, ResourceMetal } from "../loot-system-v3/resources.js";
import { AmmoTable } from "../loot-system-v3/ammo-table.js";
import { Armory } from "./armory.js";

export class SurvivorCamp {
    constructor(){
        this._foodStock = new ResourceFood();
        this._woodStock = new ResourceWood();
        this._metalStock = new ResourceMetal();
        this._ammoStock = new AmmoTable();
        this._survivorLimit = 5;
        this._armory = new Armory();
    }

    getFoodStock() {
        return this._foodStock;
    }

    getWoodStock() {
        return this._woodStock;
    }

    getMetalStock() {
        return this._metalStock;
    }

    getAmmoStock() {
        return this._ammoStock;
    }

    getSurvivorLimit() {
        return this._survivorLimit;
    }

    setSurvivorLimit(val) {
        this._survivorLimit = val;
        return this;
    }

    getArmory() {
        return this._armory;
    }

    


}