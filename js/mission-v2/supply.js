import { Team } from "./team.js";

export class Supply {

    constructor(ammo, food) {

    }

    /**
     * Returns true if some supply is sill avialable.
     * This doesn't distinguish between ammo and food.
     */
    isAvailable() {
        return true;
    }

    /**
     * Consumes the needed supplies for the given team.
     * @param {Team} team 
     * @returns true if all team members could be supplied with all needed resources, otherwise false.
     */
    replenish(team) {
        return true;
    }
}