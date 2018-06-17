import { Table } from "../math/table.js";
import { MissionParameters } from "../mission/mission-parameters.js";
import { Random } from "../math/random.js";
import { Survivor } from "./survivor.js";
import { Team } from "../mission/team.js";


export class GameCalculator {

    /**
     * @typedef Options
     * @property {boolean} addativeModifiersOn - Use addative modifiers instead of multiplicative ones
     * 
     * @param {Options} options
     */
    constructor(options){
        this._options = options;
    }

    /**
     * 
     * @param {...Table} tables 
     */
    calculateModifiers(...tables){
        if(this._options.addativeModifiersOn){
            return tables.reduce( (prev,current) => prev.add(current) );
        }else{
            return tables.reduce( (prev,current) => prev.multipy(current) );
        }
    }

    /**
     * 
     * @param {MissionParameters} modifier 
     * @param {Random=} rng 
     */
    ambushChance(modifier, rng){
        //TODO: add reduction of ambush chance if you have a higt awareness and so on
        return this._chanceBetween(
            modifier.ambushChance.min,
            modifier.ambushChance.max,
            rng
        );
    }

    /**
     * 
     * @param {MissionParameters} modifiers 
     * @param {Random=} rng - Optional. If not given the average is used.
     */
    encounterChance(modifiers, rng){
        return this._chanceBetween(
            modifiers.encounterChance.min,
            modifiers.encounterChance.max,
            rng
        );
    }

    /**
     * 
     * @param {number} min 
     * @param {number} max 
     * @param {Random=} rng 
     */
    _chanceBetween(min, max, rng){
        if(!rng){
            return (max + min) / 2; 
        }
        return rng.inBetween(min,max);
    }

    /**
     * 
     * @param {MissionParameters} modifiers 
     * @param {Random=} rng 
     */
    extraordinaryLootChance(modifiers, rng){
        this._chanceBetween(
            modifiers.lootExtraOrdinary.min,
            odifiers.lootExtraOrdinary.max,
            rng);
    }

    /**
     * 
     * @param {MissionParameters} modifiers 
     * @param {Random=} rng 
     */
    commonLootChance(modifiers, rng){
        this._chanceBetween(
            modifiers.lootCommon.min,
            modifiers.lootCommon.max,
            rng
        );
    }

    /**
     * 
     * @param {MissionParameters} modifiers 
     * @param {Random=} rng 
     */
    rareLootChance(modifiers, rng){
        this._chanceBetween(
            modifiers.lootRare.min,
            modifiers.lootRare.max,
            rng
        );
    }

    /**
     * 
     * @param {Survivor} survivor 
     * @param {MissionParameters} modifier 
     * @param {Team} team 
     */
    foodConsumptionForSurvivor(survivor, modifier, team){
        const diff = survivor.stats.hunger.max - survivor.stats.hunger.current;
        //TODO: add advance stuff later
        return diff;
    }


}

/**
 * This utility function helps to convert a table that uses modifiers like 0.2 to 1.2.
 * This is needed if modifier calculation is switchted between addarive and multiplicative.
 * In addative mode you want 0.3 + 0.3 + 1.0 so achieve 1.6
 * In multiplicative you want 1.3 * 1*3 achieve 1.69.
 */
GameCalculator.convertZeroBasedTableToOneBased = function(){

};

/**
 * This utility function helps to convert a table that uses modifiers like 1.2 to 0.2.
 * This is needed if modifier calculation is switchted between addarive and multiplicative.
 * In addative mode you want 0.3 + 0.3 + 1.0 so achieve 1.6
 * In multiplicative you want 1.3 * 1*3 achieve 1.69.
 */
GameCalculator.convertOneBasedTableToZeroBased = function(){
    
};