import { GameCalculator } from "./game-calculator.js";
import { Combat } from "../combat/combat.js";
import { Team } from "../mission/team.js";
import { MissionParameters } from "../mission/mission-parameters.js";
import { Random } from "../math/random.js";
import { GameConstants } from "./game-constants.js";
import { Zombie } from "../combat/zombie.js";

export class GameEnvironment {
    constructor(){
        this._calculator = new GameCalculator({
            addativeModifiersOn: false
        });

        this._randomNumberGenerator = new Random(Date.now() % Number.MAX_SAFE_INTEGER );
    }

    calculator(){
        return this._calculator;
    }

    get randomNumberGenerator(){
        this._randomNumberGenerator;
    }

    set randomNumberGenerator(rng){
        this._randomNumberGenerator = rng;
    }

    /**
     * 
     * @param {Team[]} teams 
     * @param {Location} location 
     * @param {MissionParameters} modifiers 
     * @param {Mission} sourceMission 
     */
    startBattle(teams, location, modifiers, ambush = false, sourceMission = null){
        const startingDist = ambush ? modifiers.range/2 : modifiers.range; //TODO: survivor awareness value
        const combat = new Combat(
            this._randomNumberGenerator,
            startingDist,
            GameConstants.COMBAT.ZOMBIE_DISTANCE_PER_ROUND
        );
        teams.forEach(team => combat.addSurvivor(...team.getLivingMembers() ));
        const zeds = this._randomNumberGenerator.inBetween(modifiers.zombies.min(), modifiers.zombies.max() );
        for(let i = 0; i <= zeds; ++i){
            const enemy = new Zombie();
            combat.addEnemy(enemy);
        }
    }
}

export const ENVIRONMENT = new GameEnvironment();


