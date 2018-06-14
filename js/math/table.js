/**
 * TODO: It would be better to make multiply and co static and then give them table a,b and the target table c. It would eliminate the new instance mess.
 */
export class Table {
    constructor(width, height){
        this._init(width, height);
    }

    _init(width = 0, height = 0){
        this._source = new Array(width * height);
        this._source.fill(0);
        this._width = width;
        this._height = height;
    }

    /**
     * checks if the given values are valid inside this table
     * @param {number} x 
     * @param {number} y
     * @returns {boolean} 
     */
    _isLegalAccess(x,y){
        return (
            this._width  > x && x >= 0 && 
            this._height > y && y >= 0);
    }

    /**
     * Returns default error message if the x and y are invalid
     * @param {number} x 
     * @param {number} y 
     * @returns {string}
     */
    _error(x,y){
        return `Table: Out of Range access width:${this._width} x:${x} height:${this._height} y:${y}`;
    }

    /**
     * @template T
     * @param {Table} table 
     * @param {function(number,number): number} operation 
     * @returns {Table}
     */
    operation(table, operation){
        if(table._width != this._width || table._height != this._height){
            throw new Error(`Error: the given table has to be same size. width: ${this._width} vs ${table._width} height: ${this._height} vs ${table._height}`);
        }
        //const result = new Table(this._width, this._height); //TODO: fixme replace with injection. No new Table because inheirated objects will no have their propertys
        /**@type {T extends Table} */
        const result = this.createIntance(this);
        result._source = this._source.slice(0);
        for(let y = 0; y < this._height; ++y){
            for(let x = 0; x < this._width; ++x) {
                const index = (this._width * y) + x;
                result._source[index] = operation(this._source[index], table._source[index]);
            }
        }
        return result;
    }
    
    /**
     * 
     * @param {Table} table 
     */
    multipy(table){
        return this.operation(table, (v1,v2) => v1 * v2);
    }

    /**
     * 
     * @param {Table} table 
     */
    add(table){
        return this.operation(table, (v1,v2) => v1 + v2);
    }

    /**
     * 
     * @param {number} value 
     */
    fill(value){
        this._source.fill(value);
        return this;
    }

    /**
     * 
     * @param {number} column 
     * @param {number} value 
     */
    fillColumn(column, value ){
        this.forEach( (x, y , currentValue , index) => {
            if(x === column){
                this._source[index] = value
            }
        });
        return this;
    }

    /**
     * 
     * @param {number} row 
     * @param {number} value 
     */
    fillRow(row, value ){
        this.forEach( (x, y , currentValue , index) => {
            if(y === row){
                this._source[index] = value
            }
        });
        return this;
    }
    
    /**
     * @param {function(number, number, number, number)} callback 
     */
    forEach(callback){
        for(let y = 0; y < this._height; ++y){
            for(let x = 0; x < this._width; ++x){
                const index = (this._width * y) + x;
                callback(x,y, this._source[index], index);
            }      
        }
        return this;
    }

    toString(){
        let str = "[\n";
        this.forEach( (x,y,value) => {
            str += value;
            if(x === this._width-1){
                str+= ",\n";
            }else{
                str+= ",";
            }
        });
        str += "]";
        return str;
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @returns {number} The value at the given position.
     */
    getCell(x,y){
        if(this._isLegalAccess(x,y) ){
            const index = (this._width * y) + x;
            return this._source[index];
        }
        throw this._error(x,y);
    }

    /**
     * Sets the given value at the given position
     * @param {number} x 
     * @param {number} y 
     * @param {number} value
     * @returns {this} 
     */
    setCell(x,y, value){
        if(!this._isLegalAccess(x,y)){
            throw this._error(x,y);
        }
        const index = (this._width * y) + x;
        this._source[index] = value;
        return this;
    }

    out(){
        console.log(this.toString());
    }

    /**
     * You must override this method if you are extending this class.
     * It will be used to create a new object in some method
     * @param {Table} parent 
     */
    createIntance(parent){
        if(Object.getPrototypeOf(parent) !== Table.prototype){

            console.warn(`
                Table: You have extended the Table class by an other class and didn't override the 'createInstance'-method.
                This could lead to problems if you add properties to ypur class and you are expecting them to be set right.
                The 'operation'-method will create a new instance of your class but cannot set the right properties for you e.g. constructor args.
                If you need such things or you are tired of the warning, override the 'createInstance'-method return your object`);
        }
        /**@type {Table} */
        const instance = Object.create(Object.getPrototypeOf(parent));
        instance._init(parent._width, parent._height);
        return instance;
    }
}