import { AugmentedTable, AugmentedTableColumnAccessHelper } from "../math/augmented-table.js";
import { GameConstants } from "../core/game-constants.js";


class Accessor extends AugmentedTableColumnAccessHelper {

    constructor(parent, row){
        super(parent, row);
    }

    max(optionalValue){
        return this.accessColumn(GameConstants.COMBAT_STATS_COLUMN_KEYS.MAX, optionalValue);
    }

    min(optionalValue){
        return this.accessColumn(GameConstants.COMBAT_STATS_COLUMN_KEYS.MIN, optionalValue);
    }

    base(optionalValue){
        return this.accessColumn(GameConstants.COMBAT_STATS_COLUMN_KEYS.BASE, optionalValue);
    }
}

export class CombatStats extends AugmentedTable{

    constructor(){
        super(
            GameConstants.COMBAT_STATS_COLUMNS,
            GameConstants.COMBAT_STATS_ROWS
        );
    }

    createColumnAccessor(row){
        return new Accessor(this, row);
    }

    createInstance(){
        return new CombatStats();
    }

    /**
     * @returns {Accessor}
     */
    get optimalRange(){
        return /**@type {Accessor} */ (this.getRow(GameConstants.COMBAT_STATS.OPTIMIAL_RANGE));
    }

    /**
     * @returns {Accessor}
     */
    get damage(){
        return /**@type {Accessor} */ (this.getRow(GameConstants.COMBAT_STATS.DAMAGE));
    }

    /**
     * @returns {Accessor}
     */
    get hitchance(){
        return /**@type {Accessor} */ (this.getRow(GameConstants.COMBAT_STATS.HIT_CHANCE));
    }

    /**
     * @returns {Accessor}
     */
    get actionsPerRound(){
        return /**@type {Accessor} */ (this.getRow(GameConstants.COMBAT_STATS.ACTION_PER_ROUND));
    }
    
    /**
     * @returns {Accessor}
     */
    get stability(){
        return /**@type {Accessor} */ (this.getRow(GameConstants.COMBAT_STATS.STABILITY));
    }

    /**
     * @returns {Accessor}
     */
    get accuracy(){
        return /**@type {Accessor} */ (this.getRow(GameConstants.COMBAT_STATS.ACCURACY));
    }


}

CombatStats.Accesscor = Accessor;