import { Supply } from "./supply.js";
import { Survivor } from "../core/character/survivor.js";

export class Team {

    /**
     * 
     * @param {Supply} supply 
     */
    constructor(supply) {
        this._supply = supply;

        /**@type {Survivor[]} */
        this._members = [];
    }

    get supply() {
        return this._supply;
    }

    get aliveMembers() {
        return this._members.filter(s => s.isAlive());
    }

    get deadMembers() {
        return this._members.filter(s => !s.isAlive());
    }

    isAlive() {
        return true;
    }

    isDead() {
        return !this.isAlive();
    }
}