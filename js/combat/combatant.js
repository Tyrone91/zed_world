import { CombatStats } from "./combat-stats.js";

function not_yet_implemented(){
    throw "Not yet implemented interface method";
}

export class Combatant {
    constructor(){}

    /**
     * @returns {CombatStats}
     */
    getCombatstats(){not_yet_implemented();}

    /**
     * @returns {string}
     */
    getName(){not_yet_implemented();}

    setHealth(health){
        not_yet_implemented();
    }

    /**
     * @returns {number}
     */
    getHealth(){
        not_yet_implemented();
    }

    /**
     * 
     * @param {number} distance 
     * @returns {number}
     */
    accuracyAt(distance, rng){
        not_yet_implemented();
    }
}