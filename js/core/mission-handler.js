import { SurvivorMission } from "../mission/survivor-mission.js";
import { LootWrapper } from "../loot-system-v2/loot-wrapper.js";
import { Survivor } from "./character/survivor.js";

export class MissionHandler {

    constructor() {

        /**@type {Set<SurvivorMission>} */
        this._missions = new Set();
    }

    /**
     * 
     * @param {SurvivorMission[]} missions 
     */
    _filterFinished(missions) {
        missions.forEach( m => this.removeMission(m));
    }

    /**
     * 
     * @param {SurvivorMission[]} missions 
     */
    _resetSurvivor(missions) {
        const surv = missions
            .map( m => m.getFinalSurvivedMembers())
            .reduce( (prev,cur) => [...prev, ...cur], []);
        surv.forEach( surv => surv.state = Survivor.States.IDLE);
        return surv;
            
    }

    /**
     * 
     * @param {SurvivorMission[]} missions 
     */
    _eliminateDeadSurvivors(missions) {
        const dead = missions
            .map( m => m.getFinalFallenMembers())
            .reduce( (prev,cur) => [...prev, ...cur], []); 
        dead.forEach( surv => surv.state = Survivor.States.DEAD);
        return dead;
            
    }

    /**
     * 
     * @param {SurvivorMission[]} missions 
     */
    _collectLoot(missions) {
        console.log(missions);  
        const collect = missions.map(m => m.getFoundLoot() ).reduce( (prev, current) => [...prev, ...current] ,[]);
        return collect;
    }

    /**
     * 
     * @param {SurvivorMission[]} missions 
     */
    _finalizeMission(missions) {
        const successful = missions.filter(m => m.getMissionState() === SurvivorMission.State.FINISHED);
        const surv = this._resetSurvivor(successful);
        const loot = this._collectLoot(successful);
        const dead = this._eliminateDeadSurvivors(missions);

        return {
            loot: loot,
            dead: dead,
            survived: surv,
            finished: missions,
            successful: successful
        };
    }

    /**
     * 
     * @param {SurvivorMission} mission 
     */
    addMission(mission) {
        this._missions.add(mission);
        return this;
    }

    /**
     * 
     * @param {SurvivorMission} mission 
     */
    removeMission(mission) {
        this._missions.delete(mission);
        return this;
    }

    update() {
        const active = [...this._missions].filter( m => !m.isFinished());
        const finished = [...this._missions].filter(m => m.isFinished());

        active.forEach(m => m.passTime());
        this._filterFinished(finished);
        return this._finalizeMission(finished);
    }

    get missions() {
        return [...this._missions];
    }

}