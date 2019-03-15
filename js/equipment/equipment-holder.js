import { Equipable } from "./equipable.js";
import { CombatStats } from "../combat/combat-stats.js";

class NullEquipment extends Equipable {

    constructor(){
        super("Empty", "Empty slot", "IRRELEVANT", "empty-equipments-slot");
    }
}

export class EquipmentHolder {

    constructor(){

        this._slots = /**@type {Map<string,Equipable>} */(new Map());
        Object.keys(EquipmentHolder.Slots).forEach( slot => this._slots.set(slot, new NullEquipment() ));
    }

    /**
     * 
     * @param {Equipable} eq 
     */
    _usedSlot(eq){
        switch(eq.type){
            case Equipable.Types.HEAD: return EquipmentHolder.Slots.HEAD;
            case Equipable.Types.BODY: return EquipmentHolder.Slots.BODY;
            case Equipable.Types.LEGS: return EquipmentHolder.Slots.LEGS;
            case Equipable.Types.ARMS: return EquipmentHolder.Slots.ARMS;
            case Equipable.Types.BELT: return EquipmentHolder.Slots.BELT;
            case Equipable.Types.WEAPON: return EquipmentHolder.Slots.MAIN_WEAPON;
            default: throw new Error("UNKNOWN_SLOT");
        }
    }

    /**
     * @param {Equipable} equipment
     * @param {"HEAD"|"BODY"|"LEGS"|"ARMS"|"BELT"|"MAIN_WEAPON"|string} slot 
     */
    equipTo(slot, equipment){
        this._slots.set(slot, equipment);
        return this;
    }

    /**
     * 
     * @param {"HEAD"|"BODY"|"LEGS"|"ARMS"|"BELT"|"MAIN_WEAPON"|string} slot 
     */
    unequipFrom(slot){
        const val = this._slots.get(slot);
        this._slots.set(slot, new NullEquipment());
        return val;
    }

    /**
     * 
     * @param {"HEAD"|"BODY"|"LEGS"|"ARMS"|"BELT"|"MAIN_WEAPON"|string} slot 
     */
    get(slot){
        return this._slots.get(slot);
    }

    /**
     * 
     * @param {"HEAD"|"BODY"|"LEGS"|"ARMS"|"BELT"|"MAIN_WEAPON"|string} slot 
     */
    isFree(slot){
        return this.get(slot) instanceof NullEquipment;
    }

    /**
     * 
     * @param {(slot:string, item:Equipable) => void} callback 
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

EquipmentHolder.Slots = {
    HEAD: "HEAD",
    BODY: "BODY",
    LEGS: "LEGS",
    ARMS: "ARMS",
    BELT: "BELT",

    MAIN_WEAPON: "MAIN_WEAPON"
};