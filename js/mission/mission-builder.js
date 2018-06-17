import { Team } from "./team.js";
import { SurvivorMission } from "./survivor-mission.js";

export class MissionBuilder{

    constructor(){
        this._teamTeam = null;
        this._teams = [];
        this._length = 1;
        this._target = null;
        this._lootDispatchers = [];
        this._rng = null;
    }

    /**
     * 
     * @param {Team[]} teams 
     */
    setTeams(teams){
        this._teams = teams;
    }

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
        if(this._lootDispatchers.length === 0){
            return false;
        }
        if(!this._rng){
            return false;
        }
        return true;
    }

    setMissionLength(length){
        this._length = length;
    }

    getMissionLength(){
        return this._length;
    }

    setLootDispatchers(dispatchers){
        this._lootDispatchers = dispatchers;
    }

    build(){
        if(!this.isReady()){
            throw "MissionBuilder is not yes ready to create a new Mission";
        }
        const m = new SurvivorMission();
        this._teams.forEach(team => m.addTeam(team));
        m.setTargetLocation(this._target);
        m.setMissionTime(this._length);
        m.addLootDispatcher(...this._lootDispatchers);
        m.setRandomNumberGenerator(this._rng);
        
        return m;
    }
}