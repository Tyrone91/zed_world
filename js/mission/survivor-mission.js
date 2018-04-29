import { Team } from "./team.js";
import { MissionParameters } from "./mission-parameters.js";


export class SurvivorMission {
    constructor(){
        /**@type {[Team]} */
        this._team = [];
        this._baseMissionValues = new MissionParameters();
        /**@type {[MissionParameters]} */
        this._additionalModifiers = [];
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
     * @param {MissionParameters} modifiers 
     */
    addAdditionalModifiers(...modifiers){
        this._additionalModifiers.push(...modifiers);
    }

    calcMissionValues(){
        const teamModifiers = this._team.map( team => team.getMissionModifiers() ).reduce( (total, current) => total.add(current) );
        const teamModifiers2 = this._team.map( team => team.getMissionModifiers() );
        
        console.log("hi");
        const missionValues = this._baseMissionValues.add(teamModifiers);
        console.log("hi");
        const additional = this._additionalModifiers.reduce( ((total, current) => total.add(current)), new MissionParameters().fill(1) );
        return missionValues.multipy(additional);
    }


}