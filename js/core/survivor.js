import { Character } from "./character.js";
import { MissionParameters } from "../mission/mission-parameters.js";

export class Survivor extends Character{
    constructor(){
        super();
        this._missionModifiers = new MissionParameters().fill(1);
    }

    /**
     * @returns {MissionParameters}
     */
    getMissionModifiers(){
        return this._missionModifiers;
    }
}