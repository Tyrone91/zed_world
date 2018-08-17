import { CombatStats } from "./combat-stats.js";

function not_yet_implemented(){
    throw "Not yet implemented interface method";
}

export class Combatant {
    constructor(){}

    /**
     * @returns {CombatStats}
     */
    get combatstats(){not_yet_implemented();}

    /**
     * @returns {string}
     */
    get name(){not_yet_implemented();}

    set health(health){
        not_yet_implemented();
    }

    get health(){
        not_yet_implemented();
    }
}