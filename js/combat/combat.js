import { Round } from "./round.js";
import { Combatant } from "./combatant.js";
import { AttackAction } from "./combat-action.js";
import { Random } from "../math/random.js";
import { ENVIRONMENT } from "../core/game-environment.js";
import { SurvivorCombatantWrapper } from "../core/character/survivor.js";

/**
 * @param {Combatant} combatant
 */
function isAlive(combatant){
    return combatant.getHealth() > 0;
}

/**
 * 
 * @param {Combatant} combatant 
 */
function hitchanceOf(combatant, distance, rng){
    return combatant.accuracyAt(distance, rng);
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

        /**@type {SurvivorCombatantWrapper[]} */
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
     * @param {...SurvivorCombatantWrapper} survivors 
     */
    addSurvivor(...survivors){
        this._surivors.push(...survivors);
    }

    _calcDistance(){
        let d = this._distanceToSurvivors - this._distanceCoveragePerRound;
        if(d < 0){
            d = 0;
        }
        return d;
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
     * @param {SurvivorCombatantWrapper} wrapper
     */
    _killSurvivor(wrapper){
        this._currentRound.addKilledSurvivor(wrapper.getSurvivor());
        this._deleteEntity(wrapper, this._surivors);
    }

    /**
     * Returns a random object from the given array that will be used as target.
     * @template T
     * @param {T[]} array
     * @returns {T} 
     */
    _randomTarget(array){   
        const index = this._rng.inBetween(0, array.length);
        return array[index];
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
        for(let i = 0; i < entity.getCombatstats().actionsPerRound.base() && !this.combatIsOver(); ++i){
            const target = this._randomTarget(this._enemies);
            this.attack(target,entity);
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
            damage = Math.floor(this._rng.inBetween(attacker.getCombatstats().damage.min(), attacker.getCombatstats().damage.max()));
            const health = target.getHealth() - damage;
            target.setHealth(health > 0 ? health : 0); 
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
        this._distanceToSurvivors = this._calcDistance();
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
            if(this.combatIsOver()) return;
            const target = this._randomTarget(this._surivors);
            this.attack(target,z);
            if(!isAlive(target)){
                this._killSurvivor(target);
            }
        }
    
    }

    rounds(){
        return this._rounds;
    }

    enemiesKilled() {
        return this._rounds.map( r => r.getKilledEnemies().length ).reduce( (p,c) => p + c ,0);
    }

    killedSurvivors() {
        return this._rounds.map( r => r.getKilledSurvivors()).reduce( (prev, cur) => prev.concat(cur) ,[]);
    }



}