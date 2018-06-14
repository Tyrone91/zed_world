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

    createIntance(parent){
        return new AmmoTable();
    }

    createColumnAccessor(rowName){
        return new AmmoAccessor(this, rowName);
    }

    get small(){
        return this.getRow(GameConstants.AMMO_TYPES.SMALL);
    }

    get medium(){
        return this.getRow(GameConstants.AMMO_TYPES.MEDIUM);
    }

    get heavy(){
        return this.getRow(GameConstants.AMMO_TYPES.HEAVY);
    }

    get special(){
        return this.getRow(GameConstants.AMMO_TYPES.SPECIAL);
    }
}