import { GameEnvironment } from "../core/game-environment.js";
import { Location } from "./location.js";
import { MissionSchedule } from "./mission-schedule.js";
import { Team } from "./team.js";
import { MissionParameters } from "../mission/mission-parameters.js";
import { Combat } from "../combat/combat.js";

const MISSION_SCHEDULE = [
    MissionSchedule.SCOUTING,
    MissionSchedule.LOOTING,
    MissionSchedule.REPLENISHMENT
];

export class Mission {

    /**
     * 
     * @param {Team} team 
     * @param {Location} target 
     * @param {number} length
     */
    constructor(team, target, length) {
        this._team = team;
        this._target = target;
        this._length = length;
        this._passedTime = 0;
        this._state = Mission.State.PENDING;
        this._modifiers = new MissionParameters().fill(1);

        /**@type {Combat[]} */
        this._foughtCombats = [];
    }

    get length() {
        return this._length;
    }

    get remainingTime() {
        return this._length - this._passedTime;
    }

    get passedTime() {
        return this._passedTime;
    }

    get team() {
        return this._team;
    }

    get state() {
        return this._state;
    }

    get target() {
        return this._target;
    }

    get modifiers() {
        return this._modifiers;
    }

    /**
     * Returns the combats that were fought while on this mission.
     */
    get combats() {
        return this._foughtCombats;
    }

    /**
     * 
     * @param  {...Combat} combat 
     */
    addFoughtCombat(...combat) {
        this._foughtCombats.push(...combat);
    }

    hasEnded() {
        return this.remainingTime <= 0 || this.state !== Mission.State.PENDING;
    }

    /**
     * Updates the mission effectively pass time, to combat if needed or changes the state. 
     * @param {GameEnvironment} context 
     */
    update(context) {
        if(!this._checkStillRunning()) {
            return;
        }
        ++this._passedTime;

        for(const schedule of MISSION_SCHEDULE) {
            const res = schedule.update(context, this);
            this._validateTeamIntegrity();
            if(!res || !this._validateTeamIntegrity()) {
                break;
            }
        }
    }
    
    _checkStillRunning() {
        this._validateTeamIntegrity();
        if(this.hasEnded()) {
            return false;
        }
        return true;
    }

    _validateTeamIntegrity() {
        if(!this._team.isAlive()) {
            this._state = Mission.State.FAILURE;
            return false;
        }
        return true;
    }
}

class MissionState {

    /**
     * 
     * @param {string} key 
     */
    constructor(key) {
        this._key = key;
    }

    toString() {
        return this._key;
    }
}

Mission.State.PENDING = new MissionState("PENDING");
Mission.State.FAILURE = new MissionState("FAILURE");
Mission.State.SUCCESSFUL = new MissionState("SUCCESSFUL");
Mission.State.RETREAT = new MissionState("RETREAT");