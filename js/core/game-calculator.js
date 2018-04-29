import { Table } from "../math/table.js";


export class GameCalculator {

    /**
     * @typedef Options
     * @property {boolean} addativeModifiersOn - Use addative modifiers instead of multiplicative ones
     * 
     * @param {Options} options
     */
    constructor(options){
        this._options = options;
    }

    /**
     * 
     * @param {...Table} tables 
     */
    calculateModifiers(...tables){
        if(this._options.addativeModifiersOn){
            return tables.reduce( (prev,current) => prev.add(current) );
        }else{
            return tables.reduce( (prev,current) => prev.multipy(current) );
        }
    }
}

/**
 * This utility function helps to convert a table that uses modifiers like 0.2 to 1.2.
 * This is needed if modifier calculation is switchted between addarive and multiplicative.
 * In addative mode you want 0.3 + 0.3 + 1.0 so achieve 1.6
 * In multiplicative you want 1.3 * 1*3 achieve 1.69.
 */
GameCalculator.convertZeroBasedTableToOneBased = function(){

};

/**
 * This utility function helps to convert a table that uses modifiers like 1.2 to 0.2.
 * This is needed if modifier calculation is switchted between addarive and multiplicative.
 * In addative mode you want 0.3 + 0.3 + 1.0 so achieve 1.6
 * In multiplicative you want 1.3 * 1*3 achieve 1.69.
 */
GameCalculator.convertOneBasedTableToZeroBased = function(){
    
};