import { Team } from "./team.js";
import { SurvivorMission } from "./survivor-mission.js";
import { ENVIRONMENT } from "../core/game-environment.js";
import { LootDispatcher } from "./loot-dispatcher.js";
import { Random } from "../math/random.js";
import { Location } from "./location.js";

export class MissionBuilder{

    constructor(){
        this._teamTeam = null;
        this._teams = [];
        this._length = 1;
        this._target = null;
        this._rng = null;
        this._combatStarter = null;
    }

    /**
     * 
     * @param {Team[]} teams 
     */
    setTeams(teams){
        this._teams = teams;
    }

    /**
     * 
     * @param {Location} location 
     */
    setTarget(location){
        this._target = location;
    }

    getTarget(){
        return this._target;
    }

    newTeam(){
        const team = new Team("New Team");
        return team;
    }

    createTempTeam(){
        this._tempTeam = new Team("Temporary Team");
        this._teams.push(this._tempTeam);
        return this._teamTeam;
    }

    /**
     * 
     * @param {Random} rng 
     */
    setRNG(rng){
        this._rng = rng;
    }

    isReady(){
        if(this._teams.length <= 0){
            return false;
        }
        if(!this._target){
            return false;
        }
        if(!this._rng){
            return false;
        }
        return true;
    }

    /**
     * 
     * @param {number} length 
     */
    setMissionLength(length){
        this._length = length;
    }

    getMissionLength(){
        return this._length;
    }

    /**
     * 
     * @param {(mission:SurvivorMission, ambush:boolean) => void} starter 
     */
    setCombatStarter(starter){
        this._combatStarter = starter;
    }

    build(){
        if(!this.isReady()){
            throw "MissionBuilder is not yes ready to create a new Mission";
        }
        const m = new SurvivorMission();
        this._teams.forEach(team => m.addTeam(team));
        m.setTargetLocation(this._target);
        m.setMissionTime(this._length);
        m.setRandomNumberGenerator(this._rng);
        if(this._combatStarter){
            m.setCombatStarter(this._combatStarter);
        }else{
            m.setCombatStarter( (mission, ambush) => {
                ENVIRONMENT.startBattle(mission.getTeams(), this._target, mission.modifier, ambush, mission);
            });
        }
       
        return m;
    }
}