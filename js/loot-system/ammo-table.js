import { AugmentedTable, AugmentedTableColumnAccessHelper } from "../math/augmented-table.js";
import { GameConstants } from "../core/game-constants.js";

class AmmoAccessor extends AugmentedTableColumnAccessHelper{
    constructor(table, rowName){
        super(table,rowName );
    }

    amount(optinalValue){
        return this.accessColumn(GameConstants.AMMO_TYPES_COLUMN_KEYS.AMOUNT, optinalValue);
    }

    
}

export class AmmoTable extends AugmentedTable{
    constructor(){
        super(
            GameConstants.AMMO_TYPES_COLUMN,
            GameConstants.AMMO_TYPES_ROW
        );
    }

    createInstance(parent){
        return new AmmoTable();
    }

    createColumnAccessor(rowName){
        return new AmmoAccessor(this, rowName);
    }

    /**
     * @returns {AmmoAccessor}
     */
    get small(){
        return this.getRow(GameConstants.AMMO_TYPES.SMALL);
    }

    /**
     * @returns {AmmoAccessor}
     */
    get medium(){
        return this.getRow(GameConstants.AMMO_TYPES.MEDIUM);
    }

    /**
     * @returns {AmmoAccessor}
     */
    get heavy(){
        return this.getRow(GameConstants.AMMO_TYPES.HEAVY);
    }

    /**
     * @returns {AmmoAccessor}
     */
    get special(){
        return this.getRow(GameConstants.AMMO_TYPES.SPECIAL);
    }

    /**
     * @returns {AmmoAccessor[]}
     */
    getAllRows(){
        return super.getAllRows();
    }
}