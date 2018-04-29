import {Survivor} from "../core/survivor.js"
import { ENVIRONMENT } from "../core/game-environment.js";

export class Team {
    constructor(){
        this._name = "NO_NAME_TEAM";

        /**@type [Survivor] */
        this._teamList = [];
    }

    get name(){
        return this._name;
    }

    name(newName){
        this._name = newName;
        return this;
    }

    /**
     * @param {...Survivor} members
     */
    addTeamMember(...members){
        this._teamList.push(...members);
    }

    /**
     * 
     * @param {Survivor} member 
     */
    removeMember(...members){
        members.forEach( mem => {
            const index = this._teamList.indexOf(men);
            if(index != -1){
                this._teamList.splice(index,1);
            }
        });
    }

    /**
     * Returns a pointer to the current team array.
     * @returns {[Survivor]}
     */
    getTeam(){
        return this._teamList;
    }

    getMissionModifiers(){
        return ENVIRONMENT.calculator().calculateModifiers( ...this._teamList.map(surv => surv.getMissionModifiers() ) );
    }

}