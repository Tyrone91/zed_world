import { GameEnvironment } from "../core/game-environment.js";
import { Mission } from "./mission.js";
import { Location } from "./location.js";
import { Random } from "../math/random.js";
import { Zombie } from "../combat/zombie.js";

/**
 * 
 * @param {Location} location 
 * @param {Random} rng 
 */
function rollZombies(location, rng) {

    const zombies = 10; //TODO: calculate

    /**@type {Zombie[]} */
    const res = [];
    for(let i = 0; i < zombies; ++i) {
        res.push( new Zombie() );
    }
    return res;
}

export class MissionSchedule {

    /**
     * 
     * @param {(context:GameEnvironment, mission:Mission ) => boolean} action 
     */
    constructor(action) {
        this._action = action;
    }

    /**
     * 
     * @param {GameEnvironment} context 
     * @param {Mission} mission 
     */
    update(context, mission) {
        if(mission.hasEnded()) {
            return false;
        }
        return this._action(context, mission);
    }
}

MissionSchedule.LOOTING = new MissionSchedule( (context, mission) => {
    return true;
});

MissionSchedule.SCOUTING = new MissionSchedule( (context, mission) => {
    const rng = context.randomNumberGenerator;
    const encChance = context.calculator().encounterChance(this._mission.modifier, this.rng);
    const comparision = rng.inBetween(0,100);
    if(comparision < encChance){
        const survs = mission.team.aliveMembers;
        const combat = context.combatHandler.startCombat(survs, rollZombies(mission.target, rng));
        mission.addFoughtCombat(combat);
        if(combat.killedSurvivors.length === survs.length) {
            return false;
        }
        return true;
    }
    return true;
});

MissionSchedule.REPLENISHMENT = new MissionSchedule( (context, mission) => {
    const team = mission.team;
    const res = team.supply.replenish(team);
    if(res) {
        return true;
    }
    //TODO: added health damage and validate if ammo or food is the reason.
    return true;
});