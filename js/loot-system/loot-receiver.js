import { AmmoTable } from "./ammo-table.js";
import { Equipment } from "../equipment/equipment.js";

function not_implemented(){
    throw `Did not implement all methods from LootReceiver`;
}

export class LootReceiver {

    /**
     * 
     * @param {number} amount 
     */
    addFood(amount){
        not_implemented();
    }

    /**
     * 
     * @param {AmmoTable} ammoTable 
     */
    addAmmo(ammoTable){
        not_implemented();
    }

    /**
     * 
     * @param {Equipment} equipment 
     */
    addEquipment(equipment){
        not_implemented();
    }
}
