import { CombatStats } from "../combat/combat-stats.js";
import { GameConstants } from "../core/game-constants.js";

export class Equipment {
    constructor(name, desc, type, icon = "default_equipment"){
        this._name = name;
        this._desc = desc;
        this._stats = new CombatStats();
        this._equipmentType = type;
        this._icon = "";
    }

    get stats(){
        return this._stats;
    }

    get name(){
        return this._name;
    }

    get description(){
        return this._desc;
    }

    get type(){
        return this._equipmentType;
    }

    get icon(){
        return this._icon;
    }

    /**
     * 
     * @param {number} distance
     * @param {CombatStats} modifier
     * @returns {Number} Value between 0 and 100
     */
    penaltyAtDistance(distance, modifier = new CombatStats().fill(1) ){
        /**@type {CombatStats} */
        const stats = this.stats.multipy(modifier);
        const upperRange = stats.optimalRange.max();
        const lowerRange = stats.optimalRange.min();
        const stability = stats.stability.base();

        if(upperRange <= distance && lowerRange >= distance){
            return 0;
        }

        let delta = 0;
        if(distance > upperRange){
            delta = distance - upperRange;
        }

        if(distance < lowerRange){
            delta = lowerRange - distance;
        }

        const normalizedStability = 1 - (stability/100);
        const penalty = Math.pow(delta, GameConstants.COMBAT.MAXIMUN_ACCURACY_PENALTY_EXPONENT) * normalizedStability;

        /*
        console.log("++++++++++++++++++++++++++++++++++");
        console.log(`.......................upperRange: ${upperRange}`);
        console.log(`.......................lowerRange: ${lowerRange}`);
        console.log(`.........................distance: ${distance}`);
        console.log(`..............normalizedStability: ${normalizedStability.toFixed(3)}`);
        console.log(`............................delta: ${delta}`);
        console.log(`MAXIMUN_ACCURACY_PENALTY_EXPONENT: ${GameConstants.COMBAT.MAXIMUN_ACCURACY_PENALTY_EXPONENT}`);
        console.log(`..........................penalty: ${penalty.toFixed(3)}`);
        */
        return penalty;
    }

    /**
     * 
     * @param {number} distance
     * @param {CombatStats} modifier
     * @returns {Number} Value between 0 and 100
     */
    accuracyAtDistance(distance, modifier = new CombatStats().fill(1) ){
        const stats = this.stats.multipy(modifier);
        const penalty = this.penaltyAtDistance(distance, modifier);
        const baseAcc = stats.accuracy.base();
        return (baseAcc - penalty) < GameConstants.COMBAT.MINIMUM_ACCURACY ? GameConstants.COMBAT.MINIMUM_ACCURACY : (baseAcc - penalty);
    }
}