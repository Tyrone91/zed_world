import {Survivor} from "../core/survivor.js"
import { ENVIRONMENT } from "../core/game-environment.js";
import { MissionParameters } from "./mission-parameters.js";
import { AmmoTable } from "../loot-system/ammo-table.js";

export class Team {
    constructor(name  = "NO_NAME_TEAM"){
        this._name = name;

        /**@type Survivor[] */
        this._teamList = [];

        this._foodStock = 0;
        this._ammo = null;
        this._continueAfterCombat = true;
    }

    getName(){
        return this._name;
    }

    setName(newName){
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
     * @param {Survivor[]} members
     */
    removeMember(...members){
        members.forEach( mem => {
            const index = this._teamList.indexOf(mem);
            if(index != -1){
                this._teamList.splice(index,1);
            }
        });
    }

    /**
     * @returns {Survivor[]} returns the living team members
     */
    getLivingMembers(){
        return this._teamList.filter( mem => mem.isAlive());
    }

    getFallenMembers(){
        return this._teamList.filter( mem => !mem.isAlive());
    }

    /**
     * Returns a pointer to the current team array.
     * @returns {Survivor[]}
     */
    getTeam(){
        return this._teamList;
    }

    /**
     * @returns {MissionParameters}
     */
    getMissionModifiers(){
        return ENVIRONMENT.calculator().calculateModifiers( ...this._teamList.map(surv => surv.getMissionModifiers() ) );
    }

    /**
     * @returns {AmmoTable}
     */
    getAmmoStock(){
        return this._ammo;
    }

    getFoodStock(){
        return this._foodStock;
    }

    setContinueAfterCombat(value){
        this._continueAfterCombat = value;
    }

    getContinueAfterCombat(){
        this._continueAfterCombat;
    }

}