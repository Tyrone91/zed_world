export class Table {
    constructor(width, height){
        this._source = new Array(width * height);
        this._source.fill(0);
        this._width = width;
        this._height = height;
    }

    /**
     * checks if the given values are valid inside this table
     * @param {number} x 
     * @param {numebr} y
     * @returns {boolean} 
     */
    _isLegalAccess(x,y){
        return (
            this._width  > x && x >= 0 && 
            this._height > y && y >= 0);
    }

    /**
     * Returns default error message if the x and y are invalid
     * @param {numeber} x 
     * @param {number} y 
     * @returns {string}
     */
    _error(x,y){
        return `Table: Out of Range access width:${this._width} x:${x} height:${this._height} y:${y}`;
    }

    /**
     * 
     * @param {Table} table 
     * @param {function(number,number) => number} operation 
     */
    operation(table, operation){
        if(table._width != this._width || table._height != this._height){
            throw new Error(`Error: the given table has to be same size. width: ${this._width} vs ${table._width} height: ${this._height} vs ${table._height}`);
        }
        const result = new Table(this._width, this._height);
        for(let y = 0; y < this._height; ++y){
            for(let x = 0; x < this._width; ++x) {
                const index = (this._width * y) + x;
                result._source[index] = operation(this._source[index], table._source[index]);
            }
        }
        return result;
    }
    
    multipy(table){
        return this.operation(table, (v1,v2) => v1 * v2);
    }

    add(table){
        return this.operation(table, (v1,v2) => v1 + v2);
    }

    fill(value){
        this._source.fill(value);
        return this;
    }

    fillColumn(value, column){
        this.forEach( (x, y , currentValue , index) => {
            if(x === column){
                this._source[index] = value
            }
        });
        return this;
    }

    fillRow(value, row){
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
     * @param {numebr} y 
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
}