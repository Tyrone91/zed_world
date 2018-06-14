import { Team } from "./team.js";
import { MissionParameters } from "./mission-parameters.js";
import { Location } from "./location.js";
import { GameConstants } from "../core/game-constants.js";

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
class MissionScheduler{

    /**
     * @param {SurvivorMission} mission 
     * @param {MissionParameters} values
     */
    constructor(mission, values){
        this._mission = mission;
        this._values = values;
        this._shedule = [
            () => this.ambush(),
            () => this.scouting(),
            () => this.restocking()
        ];
    }

    _validating(){
        return this._mission.getSurivivors().length > 0;
    }


    scouting(){
        return false;
    }

    ambush(){
        if(!GameConstants.MISSION.AMBUSH_CAN_HAPPEN){
            return false;
        }
    }

    restocking(){
        if(GameConstants.MISSION.SURVIVOR_CONSUME_FOOD){

        }

        if(GameConstants.MISSION.SURVIVOR_CONSUME_AMMO){

        }
    }

    _isRetreating(){
        return !this._mission.getTeams().find( team => team.getContinueAfterCombat());
    }

    _retreadFromMission(){
        
    }

    shedule(){
        for( const task of this._shedule){
            if(this._validating()){

            }

            const combat = task();

            if(combat && this._isRetreating() ){
                this._retreadFromMission();
                return;
            }
        }
    }



}


export class SurvivorMission {
    constructor(){

        /**@type {Team[]} */
        this._team = [];

        /**@type {Object[]} */ //TODO: finish rewards
        this._rewards = [];

        this._baseMissionValues = new MissionParameters();

        /**@type {MissionParameters[]} */
        this._additionalModifiers = [];

        /**@type {MissionParameters} */
        this._missionValues = this._baseMissionValues;

        this._passedTime = 0;
        this._missionLength = 1;

        this._targetLocation = null;
    }   

    /**
     * 
     * @param {number} time 
     */
    setMissionTime(time){
        this._missionLength = time;
    }

    timeLeft(){
        return this._missionLength - this._passedTime;
    }

    /**
     * 
     * @param {Team} team 
     */
    addTeam(team){
        this._team.push(team);
    }

    addReward(){
        //TODO: add reward
    }

    /**
     * 
     * @param {Location} location 
     */
    setTargetLocation(location){
        this._targetLocation = location;
        return this;
    }

    getTargetLocation(){
        return this._targetLocation;
    }

    isReady(){
        return this._targetLocation && this._team.length !== 0;
    }

    /**
     * 
     * @param {...MissionParameters} modifiers 
     */
    addAdditionalModifiers(...modifiers){
        this._additionalModifiers.push(...modifiers);
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

    _onTimePass(){

    }


}