import { Team } from "./team.js";
import { MissionParameters } from "./mission-parameters.js";
import { Location } from "./location.js";
import { GameConstants } from "../core/game-constants.js";
import {LootDispatcher} from "./loot-dispatcher.js";
import { LootReceiver } from "../loot-system/loot-receiver.js";
import {Random} from "../math/random.js"
import { ENVIRONMENT } from "../core/game-environment.js";
import { Survivor } from "../core/survivor.js";
import { AmmoTable } from "../loot-system/ammo-table.js";


/**
 * 
 * @param {SurvivorMission} mission 
 */
function scoutingPhase(mission){

}

/**
 * 
 * @param {SurvivorMission} mission 
 */
function passingTimeIn(mission){
    //scouting phase
    // |
    // +---> loot | battle
    // ambush phase
    // |
    // +---> ambush yes/no
    // |
    // +---> consume/refill phase
}
/**
 couting phase
 * |
 * +---> loot | battle
 * 
 * ambush phase
 * |
 * +---> ambush yes/no
 * 
 * consume/refill phase
 */
class MissionScheduler extends LootReceiver{

    /**
     * @param {SurvivorMission} mission 
     */
    constructor(mission, values){
        super();
        this._mission = mission;
        this._shedule = [
            () => this.ambush(),
            () => this.scouting(),
            () => this.restocking()
        ];
        this._retread = false;

    }

    _continueTask(){
        return this._mission.getSurivivors().length > 0 || !this._retread;
    }

    get rng(){
        return this._mission._rng;
    }

    _checkScoutingBattle(){
        const encChance = ENVIRONMENT.calculator().encounterChance(this._mission.modifier, this.rng);
        const comparision = this.rng.inBetween(0,100);
        if(comparision < encChance){
            //TODO: doBattle
            return true;
        }
        return false
    }

    scouting(){
        const fought = this._checkScoutingBattle();

        this._mission._lootDispatchers.forEach(d => {
            const dropped = d.checkForDrops(this, this._mission.modifier, this.rng);
        });
        return fought;
    }

    ambush(){
        if(!GameConstants.MISSION.AMBUSH_CAN_HAPPEN){
            return false;
        }
        const calc = ENVIRONMENT.calculator();
        const modifier = this._mission.modifier;
        const cmp = this.rng.inBetween(0,100);
        if(cmp > calc.ambushChance(modifier, this.rng) ){
            //TODO: doBattle
            return true;
        }
        return false;
    }

    restocking(){
        if(GameConstants.MISSION.SURVIVOR_CONSUME_FOOD){
            //we dont tell the survivor here to eat, all survivors will be updated at round end
            /**
             * 
             * @param {Survivor} surv 
             * @param {number} amount 
             */
            const consumeFood = (surv, amount) => {
                const foodWant = amount;
                const teams = this._mission.getTeams();
                for(const team of teams){
                    if(team.getFoodStock() > 0 ){
                        const diff = team.getFoodStock() - amount;
                        if(diff >= 0){
                            amount = 0;
                            team.setFoodStock(diff);
                            break;
                        }else{
                            amount -= team.getFoodStock();
                            team.setFoodStock(0);
                        }
                    }
                }
                if(amount > 0){
                    const diff = this._mission._foundFood - amount;
                    if(diff >= 0){
                        amount = 0;
                        this._mission._foundFood -= amount;
                    }else{
                        amount -= this._mission._foundFood;
                        this._mission._foundFood = 0;
                    }
                }
                const tmp = surv.stats.hunger.current();
                surv.stats.hunger.current(tmp + (foodWant-amount));
            };
            this._mission.getSurivivors()
            .sort( (surv1, surv2) => {
                const h1 = surv1.stats.hunger.current();
                const h2 = surv2.stats.hunger.current();

                if(h1 < h2){
                    return -1;
                }

                if(h1 > h2){
                    return 1;
                }

                return 0;
            })
            .forEach(surv => {
                const current = surv.stats.hunger.current();
                const max = surv.stats.hunger.max();
                consumeFood(surv, max - current); //TODO: give team an average consume if not enough
            });
        }

        if(GameConstants.MISSION.SURVIVOR_CONSUME_AMMO){
            console.log("AMMO RFILL NOT YET IMPLEMENTED"); //TODO: finish
        }
    }

    _isRetreating(){
        return !this._mission.getTeams().find( team => team.getContinueAfterCombat());
    }

    _retreadFromMission(){
        this._retread = true;
    }

    shedule(){
        for( const task of this._shedule){
           
            if(!this._continueTask()){
                return;
            }

            const combat = task();
            if(combat && this._isRetreating() ){
                this._retreadFromMission();
                return;
            }
        }
    }

    /**
     * 
     * @param {AmmoTable} ammoTable 
     */
    addAmmo(ammoTable){
        const newTable = this._mission._foundAmmo.add(ammoTable);
        this._mission._foundAmmo = newTable;
    }

    addFood(amount){
        this._mission._foundEquipment += amount;
    }

    addEquipment(equipment){
        this._mission._foundEquipment.push(equipment);
    }
}


export class SurvivorMission {
    constructor(){

        /**@type {Team[]} */
        this._team = [];

        this._baseMissionValues = new MissionParameters();

        /**@type {MissionParameters[]} */
        this._additionalModifiers = [];

        /**@type {MissionParameters} */
        this._missionValues = this._baseMissionValues;

        this._passedTime = 0;
        this._missionLength = 1;

        this._targetLocation = null;

        /**@type {LootDispatcher[]} */
        this._lootDispatchers = [];

        /**@type {Random} */
        this._rng = null;

        this._foundAmmo = new AmmoTable();;
        this._foundFood = 0;
        this._foundEquipment  = [];
        this._earlyReturn = false;
    }   

    /**
     * 
     * @param {number} time 
     */
    setMissionTime(time){
        this._missionLength = time;
    }

    setRandomNumberGenerator(rng){
        this._rng = rng;
    }

    timeLeft(){
        return this._missionLength - this._passedTime;
    }

    isFinished(){
        return this.timeLeft() <= 0 || this._earlyReturn || this.getSurivivors().length === 0;
    }

    /**
     * 
     * @param {Team} team 
     */
    addTeam(team){
        this._team.push(team);
    }

    /**
     * 
     * @param {Location} location 
     */
    setTargetLocation(location){
        this._targetLocation = location;
        return this;
    }

    /**
     * @returns {Location}
     */
    getTargetLocation(){
        return this._targetLocation;
    }

    /**
     * 
     * @param {...MissionParameters} modifiers 
     */
    addAdditionalModifiers(...modifiers){
        this._additionalModifiers.push(...modifiers);
    }

    /**
     * @returns {MissionParameters[]}
     */
    getAdditionalModifiers(){
        return this._additionalModifiers;
    }

    /**
     * @returns {MissionParameters}
     */
    getBaseValues(){
        return this._baseMissionValues;
    }

    start(){

    }

    passTime(){
        this._onTimePass();
        this._passedTime++;
        return this;
    }

    /**
     * Returns the living members of all teams
     * @returns {Survivor[]}
     */
    getSurivivors(){
        return this._team
            .map(team => team.getLivingMembers() )
            .reduce( (prev, current) => prev.concat(current), [] );
    }

    getTeams(){
        return this._team;
    }

    addLootDispatcher(...dispatchers){
        this._lootDispatchers.push(...dispatchers);
    }

    _onTimePass(){
        const shedule = new MissionScheduler(this);
        shedule.shedule();
        if(shedule._retread){
            this._earlyReturn = true;
        }
    }

    /**
     * @returns {MissionParameters}
     */
    get modifier(){
        return ENVIRONMENT.calculator().calculateFinalMissionValues(this);
    }


}