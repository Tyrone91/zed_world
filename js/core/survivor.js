import { Character } from "./character.js";
import { MissionParameters } from "../mission/mission-parameters.js";
import { CharacterStats } from "./character-stats.js";
import { CombatStats } from "../combat/combat-stats.js";

export class Survivor extends Character{
    constructor(){
        super();
        this._missionModifiers = new MissionParameters().fill(1);
        this._stats = new CharacterStats();
        this._stats.health.current(1);
        this._combatstats = new CombatStats();
        this._currentState = Survivor.States.IDLE;
    }

    /**
     * @returns {MissionParameters}
     */
    getMissionModifiers(){
        return this._missionModifiers;
    }

    isAlive(){
        return this.stats.health.current() > 0;
    }

    get stats(){
        return this._stats;
    }

    get combatstats(){
        return this._combatstats;
    }

    get health(){
        return this._stats.health.current();
    }

    set health(newhealth){
        this._stats.health.current(newhealth);
    }

    get state(){
        return this._currentState;
    }

    set state(newState){
        this._currentState = newState;
    }

    isAvailable(){
        if(this._currentState === Survivor.States.IDLE){
            return true;
        } else {
            return false;
        }
    }
}

Survivor.States = {
    IDLE: "IDLE",
    ON_MISSION: "ON_MISSION",
    TRAINING: "TRAINING"
}
