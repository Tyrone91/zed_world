import { Equipable } from "../equipment/equipable.js";

export class Armory {

    constructor() {

        /**@type {Equipable[]} */
        this._equipment = [];

        /**@type {Equipable[]} */
        this._unresolvedEquipment = [];

        this._armorySize = 20;
    }

    getAllEquipment() {
        return this._equipment;
    }

    /**
     * 
     * @param {Equipable.EquipmentType} type 
     */
    getEquipmentByType(type) {
        return this._equipment.filter( e => e.type === type);
    }

    getArmorySize() {
        return this._armorySize;
    }

    hasSpaceLeft() {
        return this._equipment.length <= this._armorySize;
    }

    /**
     * 
     * @param  {...Equipable} equipment 
     */
    addEquipment(...equipment) {
        equipment.forEach( e => {
            if(this.hasSpaceLeft()) {
                this._equipment.push(e);
            } else {
                this._unresolvedEquipment.push(e);
            }
        });
    }

    /**
     * 
     * @param {Equipable} equipment 
     */
    removeEquipment(equipment) {
        const idx = this._equipment.indexOf(equipment);
        if(idx !== -1) {
            this._equipment.splice(idx,1);
            return true;
        }
        return false;
    }

    getUnresolvedEquipment() {
        return this._unresolvedEquipment;
    }

}