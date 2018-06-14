import { AugmentedTable, AugmentedTableColumnAccessHelper } from "../math/augmented-table.js";
import { GameConstants } from "./game-constants.js";

class StatsAccessor extends AugmentedTableColumnAccessHelper {

    constructor(parent, rowName){
        super(parent, rowName);
    }

    current(optional){
        return this.accessColumn(GameConstants.CHARACTER_STATS_COLUMN_KEYS.CURRENT, optional);
    }

    max(optional){
        return this.accessColumn(GameConstants.CHARACTER_STATS_COLUMN_KEYS.MAX, optional);
    }

}

export class CharacterStats extends AugmentedTable{
    constructor(){
        super(GameConstants.CHARACTER_STATS_COLUMNS, GameConstants.CHARACTER_STATS_ROWS);
    }

    createColumnAccessor(rowName){
        return new StatsAccessor(rowName);
    }

    createIntance(parent){
        return new CharacterStats();
    }

    /**
     * @returns {StatsAccessor}
     */
    get health(){
        return this.getRow(GameConstants.CHARACTER_STATS.HEALTH);
    }

    /**
     * @returns {StatsAccessor}
     */
    get hunger(){
        return this.getRow(GameConstants.CHARACTER_STATS.HUNGER);
    }
}