import { Table } from "./table.js";

export class AugmentedTable extends Table {
    /**
     * 
     * @param {string[]} rows - A list of strings representing the name of each row 
     * @param {string[]} columns - A list of strings representing the name of each column
     */
    constructor(columns, rows){
    
        super(columns.length, rows.length);
        this._rows = rows;
        this._columns = columns;  

    }

    /**
     * @param {string} rowName;
     * @returns {AugmentedTableColumnAccessHelper}
     */
    getRow(rowName){
        const accessCheck = this._rows.indexOf(rowName);
        if(accessCheck === -1){
            throw `AugmentedTable: Illegal row access with: ${rowName}.\
            Allowed are: ${this._rows.join(", ")}`;
        }
        return this.createColumnAccessor(rowName);
    }

    /**
     * @returns {AugmentedTableColumnAccessHelper[]}
     */
    getAllRows(){
        return this._rows.map( row => this.getRow(row) );
    }

    getRowNames(){
        return this._rows;
    }

    getColumnNames(){
        return this._columns;
    }

    /**
     * 
     * @param {AugmentedTable} parent 
     */
    createInstance(parent){
        const res = new AugmentedTable(parent._columns, parent._rows);
        //res._accessFactory = Function.bind(this._accessFactory, res);
        return res; //the accessFactory is shared. we use apply because of that
    }

    /**
     * @template T
     * 
     * @param {string} rowName
     * @returns {AugmentedTableColumnAccessHelper<T>} 
     */
    createColumnAccessor(rowName){
        if(AugmentedTable.prototype !== Object.getPrototypeOf(this)){
            throw "AugmentedTable: You are using an inherited class. Please override createColumnAccessor";
        }
        return new AugmentedTableColumnAccessHelper(this, rowName);
    }
    
}

export class AugmentedTableColumnAccessHelper{

    /**
     * 
     * @param {AugmentedTable} parent 
     * @param {string} rowName 
     */
    constructor(parent, rowName){
        this._parent = parent;
        this._rowName = rowName;
    }

    _read(columnName){
        const yIndex = this._parent._rows.indexOf(this._rowName);
        const xIndex = this._parent._columns.indexOf(columnName);
        return this._parent.getCell(xIndex,yIndex);
    }

    _write(columnName, value){
        const yIndex = this._parent._rows.indexOf(this._rowName);
        const xIndex = this._parent._columns.indexOf(columnName);
        this._parent.setCell(xIndex,yIndex,value);
    }

    /**
     * Sets or get the value at the given column.
     * If optionalValue is undefined this function will act like a getter, otherwise as a setter. 
     * @param {string} columnName 
     * @param {number=} optionalValue
     * @returns {(number|this)}
     */
    accessColumn(columnName, optionalValue){
        const accessCheck = this._parent._columns.indexOf(columnName);
        if(accessCheck === -1){
            throw `AugmentedTable: Illegal column access with: ${columnName}.\
            Allowed are: ${this._parent._columns.join(", ")}`;
        }
        if(typeof optionalValue !== "undefined"){
            this._write(columnName, optionalValue);
            return this;
        }else{
            return this._read(columnName);
        }
    }

    /**
     * @returns number[]
     */
    getAllColumns(){
        return this._parent._columns.map( column => this.accessColumn(column) );
    }

    get name(){
        return this._rowName;
    }
}