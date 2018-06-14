import { Character } from "./character.js";
import { MissionParameters } from "../mission/mission-parameters.js";
import { CharacterStats } from "./character-stats.js";

export class Survivor extends Character{
    constructor(){
        super();
        this._missionModifiers = new MissionParameters().fill(1);
        this._stats = new CharacterStats();
    }

    /**
     * @returns {MissionParameters}
     */
    getMissionModifiers(){
        return this._missionModifiers;
    }

    isAlive(){
        this.stats.health.current() > 0;
    }

    get stats(){
        return this._stats;
    }
}