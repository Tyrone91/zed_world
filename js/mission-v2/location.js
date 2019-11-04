import { Position } from "../util/position.js";
import { MissionParameters } from "../mission/mission-parameters.js";

export class Location {
    
    /**
     * 
     * @param {string} name 
     * @param {string} description 
     * @param {Position} position 
     */
    constructor(name, description, modifier = new MissionParameters() ,position = Position.of(), icon = "empty.jpg") {
        this._name = name;
        this._description = description;
        this._modifier = modifier;
        this._position = position;
        this._icon = icon;
        this._accessible = true;
    }

    get name() {
        return this._name;
    }

    get description() {
        return this._description;
    }

    get position() {
        return this._position;
    }
    
    get modifier() {
        return this._modifier;
    }

    get icon() {
        return this._icon;
    }

    get accessible() {
        return this._accessible;
    }

    /**
     * Sets the location {@link Location#accessible}.
     * @param {boolean} lock 
     */
    lockLocation(lock) {
        this._accessible = lock;
    }
}