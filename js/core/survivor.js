import { Character } from "./character.js";
import { MissionParameters } from "../mission/mission-parameters.js";
import { CharacterStats } from "./character-stats.js";
import { CombatStats } from "../combat/combat-stats.js";
import { ENVIRONMENT } from "./game-environment.js";
import { Combatant } from "../combat/combatant.js";
import { Equipable } from "../equipment/equipable.js";
import { EquipmentHolder } from "../equipment/equipment-holder.js";

export class SurvivorFist extends Equipable {
    constructor(){
        super("SURVIVOR_FIST","If you left with nothing more", Equipable.Type.WEAPON, "survivor_fist.jpg");
        this.stats.accuracy.base(100);
        this.stats.stability.base(0);
        this.stats.optimalRange.min(0).max(0);
        this.stats.damage.min(1).max(3);
    }
}

export class Survivor extends Character {
    constructor() {
        super();
        this._missionModifiers = new MissionParameters().fill(1);
        this._stats = new CharacterStats();
        this._stats.health.current(1);
        this._combatstats = new CombatStats();
        this._currentState = Survivor.States.IDLE;
        this._portrait = "generic.jpg";
        this._equipment = new EquipmentHolder();
        
        this.equipment.equip(new SurvivorFist());

        /**@type {((survivor:Survivor, listener:function) => void)[]} */
        this._stateChangeListener = []; //TODO: is equipment change a state change?
    }

    _notifyStateChange() {
        this._stateChangeListener.forEach(l => l(this,l) );
    }

    /**
     * @returns {MissionParameters}
     */
    getMissionModifiers() {
        return this._missionModifiers;
    }

    isAlive() {
        return this.stats.health.current() > 0;
    }

    get stats() {
        return this._stats;
    }

    get combatstats() {
        console.log("Base Stats:",this._combatstats.toString());
        console.log("Equipment Stats:", this._equipment.stats.toString());
        return /**@type {CombatStats} */(this._combatstats.add(this._equipment.stats));
    }

    get health() {
        return /**@type {number} */(this._stats.health.current());
    }

    set health(newhealth) {
        this._stats.health.current(newhealth);
        this._notifyStateChange();
    }

    get state() {
        return this._currentState;
    }

    /**
     * @param {string} newState
     */
    set state(newState) {
        this._currentState = newState;
        this._notifyStateChange();
    }

    get portrait() {
        return this._portrait;
    }

    set portrait(newVal) {
        this._portrait = newVal;
    }

    get equipment(){
        return this._equipment;
    }

    /**
     * 
     * @param {(survivor:Survivor, listener:function) => void} callback 
     */
    onstateChange(callback) {
        this._stateChangeListener.push(callback);
    }

    isAvailable() {
        if(this._currentState === Survivor.States.IDLE){
            return true;
        } else {
            return false;
        }
    }
}

export class SurvivorCombatantWrapper extends Combatant {
    
    /**
     * 
     * @param {Survivor} survivor 
     */
    constructor(survivor){
        super();
        this._survivor = survivor;
    }
    
    getCombatstats() {
        return /**@type {CombatStats} */(this._survivor.combatstats);
    }

    getHealth() {
        return this._survivor.health;
    }

    setHealth(newhealth) {
        this._survivor.health = newhealth;
    }

    getName() {
        return /**@type {string} */(this._survivor.name());
    }

    getSurvivor(){
        return this._survivor;
    }

    accuracyAt(distance, rng){
        return this._survivor._equipment
            .get(EquipmentHolder.Slot.MAIN_WEAPON)
            .accuracyAtDistance(distance, /**@type {CombatStats} */(this._survivor.combatstats.multiply(this._survivor.equipment.modifiers)) );
    }
}

Survivor.States = {
    IDLE: "IDLE",
    ON_MISSION: "ON_MISSION",
    TRAINING: "TRAINING",
    DEAD: "DEAD"
}
