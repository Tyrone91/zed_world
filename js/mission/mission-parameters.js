import { Table } from "../math/table.js";
import { GameConstants } from "../core/game-constants.js";
import { AugmentedTableColumnAccessHelper, AugmentedTable } from "../math/augmented-table.js";

class AccessHelper extends AugmentedTableColumnAccessHelper{

    /**
     * @param {number=} [optionalValue]
     */
    min(optionalValue){
        return this.accessColumn(GameConstants.MISSION_PARAMETERS_COLUMN_KEYS.MIN, optionalValue);
    }

    /**
     * @param {number=} [optionalValue]
     */
    active(optionalValue){
        return this.accessColumn(GameConstants.MISSION_PARAMETERS_COLUMN_KEYS.ACTIVE, optionalValue);
    }

    /**
     * @param {number=} [optionalValue]
     */
    max(optionalValue){
        return this.accessColumn(GameConstants.MISSION_PARAMETERS_COLUMN_KEYS.MAX, optionalValue);
    }

    /**
     * @param {number=} [optionalValue]
     */
    base(optionalValue){
        return this.accessColumn(GameConstants.MISSION_PARAMETERS_COLUMN_KEYS.BASE, optionalValue);
    }
}

export class MissionParameters extends AugmentedTable{
    constructor(){
        super(
            GameConstants.MISSION_PARAMETERS_COLUMNS,
            GameConstants.MISSION_PARAMETERS_ROWS,
            rowName => new AccessHelper(this,rowName)
        );
    }

    /**
     * @returns {AccessHelper}
     */
    get range(){
        return new AccessHelper(this,GameConstants.MISSION_PARAMETERS_ROW_KEYS.RANGE);
    }

    /**
     * @returns {AccessHelper}
     */
    get zombies(){
        return new AccessHelper(this, GameConstants.MISSION_PARAMETERS_ROW_KEYS.ZOMBIES);
    }

     /**
     * @returns {AccessHelper}
     */
    get lootCommon(){
        return new AccessHelper(this, GameConstants.MISSION_PARAMETERS_ROW_KEYS.LOOT_COMMON);
    }

     /**
     * @returns {AccessHelper}
     */
    get lootRare(){
        return new AccessHelper(this, GameConstants.MISSION_PARAMETERS_ROW_KEYS.LOOT_RARE);
    }

     /**
     * @returns {AccessHelper}
     */
    get lootExtraOrdinary(){
        return new AccessHelper(this, GameConstants.MISSION_PARAMETERS_ROW_KEYS.LOOT_EXTRAORDINARY);
    }

     /**
     * @returns {AccessHelper}
     */
    get reinforcement(){
        return new AccessHelper(this, GameConstants.MISSION_PARAMETERS_ROW_KEYS.REINFORCEMENT);
    }

     /**
     * @returns {AccessHelper}
     */
    get ambushChance(){
        return new AccessHelper(this, GameConstants.MISSION_PARAMETERS_ROW_KEYS.AMBUSH_CHANCE);
    }

     /**
     * @returns {AccessHelper}
     */
    get coverFrequency(){
        return new AccessHelper(this, GameConstants.MISSION_PARAMETERS_ROW_KEYS.COVER_FREQUENCY);
    }

    /**
     * @returns {AccessHelper}
     */
    get missionLength(){
        return new AccessHelper(this, GameConstants.MISSION_PARAMETERS_ROW_KEYS.MISSION_LENGTH);
    }
    
    getParameter(parameterName){
        return new AccessHelper(this, parameterName);
    }

    getParameters(){
        return this.getRowNames().map( name => this.getParameter(name));
    }
}