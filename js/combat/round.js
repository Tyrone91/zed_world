import { Combatant } from "./combatant.js";
import { CombatAction } from "./combat-action.js";
import { Survivor } from "../core/survivor.js";
import { Zombie } from "./zombie.js";

export class Round{

    /**
     * 
     * @param {number} roundNum 
     * @param {Combatant[]} aliveSurvivors 
     * @param {Combatant[]} enemies 
     */
    constructor(roundNum, aliveSurvivors, enemies, distance){
        this._num = roundNum;
        this._actions = [];
        this._aliveSurvivors = aliveSurvivors.slice();
        this._enemies = enemies.slice();
        this._killedSurvivors = [];
        this._killedEnemies = [];
        this._distance = distance;
    }

    /**
     * Round number of this round.
     * @returns {number}
     */
    get number(){
        return this._num;
    }

    /**
     * @returns {number}
     */
    get distance(){
        return this._distance;
    }

    /**
     * 
     * @param {CombatAction} actions 
     */
    addAction(...actions){
        this._actions.push(...actions);
        return this;
    }

    /**
     * @returns {CombatAction[]}
     */
    getActions(){
        return this._actions;
    }

    /**
     * @returns {Survivor[]}
     */
    getKilledSurvivors(){
        return this._killedSurvivors;
    }

    /**
     * @returns {Zombie[]} //TODO: Add the moment this are just zombies
     */
    getKilledEnemies(){
        return this._killedEnemies;
    }

    /**
     * 
     * @param {Survivor} c 
     */
    addKilledSurvivor(c){
        this._killedSurvivors.push(c);
    }

    /**
     * 
     * @param {Zombie} c //TODO: Add the moment this are just zombies
     */
    addKilledEnemy(c){
        this._killedEnemies.push(c);
    }
}