import { Combat } from "../combat/combat.js";
import { GameEnvironment } from "./game-environment.js";
import { Survivor, SurvivorCombatantWrapper } from "./character/survivor.js";
import { Zombie } from "../combat/zombie.js";

export class CombatHandler {

    /**
     * 
     * @param {GameEnvironment} context 
     */
    constructor(context) {
        this._context = context;
    }

    /**
     * 
     * @param {Survivor[]} survivors 
     * @param {Zombie[]} enemies 
     */
    startCombat(survivors, enemies) {
        const dist = 0;
        const distPerRound = 7;
        const c = new Combat(this._context.randomNumberGenerator, dist, distPerRound);
        c.addSurvivor(...survivors.map(s => new SurvivorCombatantWrapper(s)));
        c.addEnemy(...enemies);
        c.start();
        return c;
    }
}