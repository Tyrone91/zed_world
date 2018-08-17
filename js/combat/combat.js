import { Round } from "./round.js";
import { Combatant } from "./combatant.js";
import { AttackAction } from "./combat-action.js";
import { Random } from "../math/random.js";
import { ENVIRONMENT } from "../core/game-environment.js";

/**
 * @param {Combatant} combatant
 */
function isAlive(combatant){
    return combatant.health > 0;
}

/**
 * 
 * @param {Combatant} combatant 
 */
function hitchanceOf(combatant, distance, rng){
    return ENVIRONMENT.calculator().hitchance(distance, combatant.combatstats, rng);
}

export class Combat {

    /**
     * 
     * @param {Random} rng 
     * @param {number} startingDistance
     * @param {number} distanceCoveragePerRound
     */
    constructor(rng, startingDistance, distanceCoveragePerRound){
        this._rng = rng;
        this._roundNr = 1;
        /**@type {Round} */
        this._currentRound = null;
        this._distanceCoveragePerRound = distanceCoveragePerRound;
        this._distanceToSurvivors = startingDistance;

        /**@type {Combatant[]} */
        this._surivors = [];

        /**@type {Combatant[]} */
        this._enemies = [];

        /**@type {Round[]} */
        this._rounds = [];
        
    }

    /**
     * 
     * @param {...Combatant} enemies 
     */
    addEnemy(...enemies){
        this._enemies.push(...enemies);
    }

    /**
     * 
     * @param {...Combatant} survivors 
     */
    addSurvivor(...survivors){
        this._surivors.push(...survivors);
    }

    _calcDistance(){
        let d = this._distanceToSurvivors - this._distanceCoveragePerRound;
        if(d < 0){
            d = 0;
        }
        return 0;
    }

    _enemiesInRange(){
        return this._distanceToSurvivors === 0;
    }

    /**
     * 
     * @param {Combatant} entity 
     * @param {Combatant[]} array
     */
    _deleteEntity(entity, array){
        const indexOf = array.indexOf(entity);
        if(indexOf === -1){
            return;
        }
        array.splice(indexOf);
    }

    /**
     * 
     * @param {Combatant} enemy 
     */
    _killEnemey(enemy){
        this._currentRound.addKilledEnemy(enemy);
        this._deleteEntity(enemy, this._enemies);
    }

    /**
     * 
     * @param {Combatant} survivor 
     */
    _killSurvivor(survivor){
        this._currentRound.addKilledSurvivor(survivor);
        this._deleteEntity(survivor, this._surivors);
    }

    /**
     * Returns a random object from the given array taht will be used as target.
     * @param {Combatant[]} array
     * @returns {Combatant} 
     */
    _randomTarget(array){   
        return array[this._rng.inBetween(0, array.length)];
    }

    /**
     * 
     * @param {Combatant} combatant 
     */
    distanceOf(combatant){
        return this._distanceToSurvivors; // TODO: we could add that every zombie hat its own distance to the survivors. Then we could focus on the nearest or stongtest etc.
    }

    /**
     * 
     * @param {Combatant} entity 
     */
    _actionOf(entity){
        for(let i = 0; i < entity.combatstats.actionsPerRound.base(); ++i){
            const target = this._randomTarget(this._enemies);
            this.attack(target,c);
            if(!isAlive(target)){
                this._killEnemey(target);
            }
        }
    }

    /**
     * 
     * @param {Combatant} target 
     * @param {Combatant} attacker 
     */
    attack(target, attacker){
        let damage = 0;
        const hitchance = hitchanceOf(attacker, this.distanceOf(target), this._rng );
        let hit = false;

        if(hitchance > this._rng.inBetween(0,100)){
            hit = true;
            damage = Math.floor(this._rng.inBetween(target.combatstats.damage.min(), target.combatstats.damage.max()));
            const health = target.health - damage;
            target.health = health > 0 ? health : 0; 
        }
        //TODO: add bullet consumption
        const action = new AttackAction(attacker, target, damage, hitchance, hit);
        this._currentRound.addAction(action);
    }

    combatIsOver(){
        return this._surivors.length === 0 || this._enemies.length === 0;
    }

    start(){
        this._currentRound = new Round(this._roundNr, this._surivors, this._enemies, this._distanceToSurvivors);
        while(!this.combatIsOver()){
            this.processRound();
        }
    }

    processRound(){
        this.processActions();
        this._rounds.push(this._currentRound);
        this._distanceToSurvivors -= this._calcDistance();
        ++this._roundNr;
        this._currentRound = new Round(this._roundNr, this._surivors, this._enemies, this._distanceToSurvivors);
    }

    processActions(){
        
        for( const c of this._surivors){
            this._actionOf(c);
        }

        if(!this._enemiesInRange()){
            return;
        }

        for( const z of this._enemies){
            const target = this._randomTarget(this._surivors);
            this.attack(target,z);
            if(!isAlive(target)){
                this._killSurvivor(target);
            }
        }
    
    }



}