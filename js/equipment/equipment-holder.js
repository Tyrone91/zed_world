import { Equipable } from "./equipable.js";
import { CombatStats } from "../combat/combat-stats.js";

class NullEquipment extends Equipable {

    constructor(){
        super("Empty", "Empty slot", Equipable.Type.NONE, "empty-equipments-slot");
    }
}

export class EquipmentHolder {

    constructor(){

        this._slots = /**@type {Map<HolderSlot,Equipable>} */(new Map());
        Object.keys(EquipmentHolder.Slot).forEach( slot => this._slots.set(EquipmentHolder.Slot[slot], new NullEquipment() ));
    }

    /**
     * 
     * @param {Equipable} eq 
     */
    _usedSlot(eq){
        switch(eq.type){
            case Equipable.Type.HEAD: return EquipmentHolder.Slot.HEAD;
            case Equipable.Type.BODY: return EquipmentHolder.Slot.BODY;
            case Equipable.Type.LEGS: return EquipmentHolder.Slot.LEGS;
            case Equipable.Type.ARMS: return EquipmentHolder.Slot.ARMS;
            case Equipable.Type.BELT: return EquipmentHolder.Slot.BELT;
            case Equipable.Type.WEAPON: return EquipmentHolder.Slot.MAIN_WEAPON;
            default: throw new Error("UNKNOWN_SLOT");
        }
    }

    /**
     * @param {Equipable} equipment
     * @param {HolderSlot} slot 
     */
    equipTo(slot, equipment){
        this._slots.set(slot, equipment);
        return this;
    }

    /**
     * 
     * @param {HolderSlot} slot 
     */
    unequipFrom(slot){
        const val = this._slots.get(slot);
        this._slots.set(slot, new NullEquipment());
        return val;
    }

    /**
     * 
     * @param {HolderSlot} slot 
     */
    get(slot){
        return this._slots.get(slot);
    }

    /**
     * 
     * @param {HolderSlot} slot 
     */
    isFree(slot){
        return this.get(slot) instanceof NullEquipment;
    }

    /**
     * 
     * @param {(slot:HolderSlot, item:Equipable) => void} callback 
     */
    forEach(callback){
        this._slots.forEach( (eq, slot) => callback(slot,eq));
    }

    clear(){
        this._slots.clear();
    }

    /**
     * 
     * @param {Equipable} equipment 
     */
    equip(equipment) {
        const slot = this._usedSlot(equipment);
        if(!this.isFree(slot)){
            throw new Error("EQUIPMENT SLOT ALREADY IN USE");
        }
        this.equipTo(slot, equipment);
        return this;
    }

    /**
     * 
     * @param {Equipable} equipment 
     */
    unequip(equipment) {
        const slot = this._usedSlot(equipment);
        if(!(this.get(slot) === equipment)) {
            throw new Error("EQUIPMENT IS NOT EQUIPED");
        }
        this.unequipFrom(slot);
        return this;
    }


    get stats(){
        return [...this._slots.values()].map(e => e.stats).reduce( (prev, cur) => prev.add(cur), new CombatStats() );
    }

    get modifiers(){
        return [...this._slots.values()].map(e => e.modifier).reduce( (prev, cur) => prev.add(cur), new CombatStats() );
    }

}

class HolderSlot {

    /**
     * @param {string} id 
     */
    constructor(id) {
        this._id = id;
    }

    id() {
        return this._id;
    }
}

EquipmentHolder.Slot = {
    HEAD: new HolderSlot("HEAD"),
    BODY: new HolderSlot("BODY"),
    LEGS: new HolderSlot("LEGS"),
    ARMS: new HolderSlot("ARMS"),
    BELT: new HolderSlot("BELT"),
    MAIN_WEAPON: new HolderSlot("MAIN_WEAPON")
};