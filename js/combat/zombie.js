import { Combatant } from "./combatant.js";
import { CombatStats } from "./combat-stats.js";


const ZOMBIE_STATS = new CombatStats(); //TODO: at the current state all zombies are equal and therefore they share their stats.
ZOMBIE_STATS.hitchance.min(100).max(100);
ZOMBIE_STATS.optimalRange.min(0).max(100);
ZOMBIE_STATS.actionsPerRound.max(1).min(1);
ZOMBIE_STATS.damage.min(10).max(20);

export class Zombie extends Combatant{
    constructor() {
        super();
        this._health = 50;
    }

    getCombatstats() {
        return ZOMBIE_STATS;
    }

    getHealth() {
        return this._health;
    }

    setHealth(newhealth) {
        this._health = newhealth;
    }

    getName() {
        return "Undead";
    }

    accuracyAt(distance){
        return distance === 0 ? 100 : 0;
    }

    
}