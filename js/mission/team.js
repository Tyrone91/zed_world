import {Survivor} from "../core/survivor.js"
import { ENVIRONMENT } from "../core/game-environment.js";
import { MissionParameters } from "./mission-parameters.js";
import { AmmoTable } from "../loot-system/ammo-table.js";
import { Table } from "../math/table.js";
import { CombatStats } from "../combat/combat-stats.js";

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
     * @param {...Survivor} potentialMembers
     * @returns {MissionParameters}
     */
    getMissionModifiers(...potentialMembers){
        const list = [...this._teamList, ...potentialMembers];
        if(list.length === 0){
            return new MissionParameters().fill(0);
        }
        return ENVIRONMENT.calculator().calculateModifiers( ...list.map(surv => surv.getMissionModifiers() ) );
    }

    /**
     * @param {...Survivor} potentialMembers
     * @returns {CombatStats}
     */
    getAverageCombatStats(...potentialMembers) {
        const list = [...this._teamList, ...potentialMembers];
        if(list.length === 0){
            return new CombatStats().fill(0);
        }
        return Table.avg(...list.map(s => s.combatstats));
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

    setFoodStock(amount){
        this._foodStock = amount;
    }

    getFoundEquipment(){
        return this._foundEquipment;
    }

    addFoundEquipment(equipment){
        this._foundEquipment.push(equipment);
    }

    clearFoundEquipment(){
        this._foundEquipment = [];
    }

    setContinueAfterCombat(value){
        this._continueAfterCombat = value;
    }

    getContinueAfterCombat(){
        this._continueAfterCombat;
    }

}