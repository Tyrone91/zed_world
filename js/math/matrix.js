export class Matrix {

    /**
     * 
     * @param {Matrix} matrix 
     */
    _checkMultiplyCondition(matrix){
        return this._width === matrix._height;
    }

    /**
     * 
     * @param {number} width 
     * @param {number} height 
     * @param {[number]=} src optional
     */
    constructor(width, height, src){
        if(!src){
            src = new Array(width * height);
            src.fill(0);
        }

        this._source = src.slice();
        this._width = width;
        this._height = height;
    }

    fill(value){
        this._source.fill(value);
    }

    /**
     * 
     * @param {Matirx} matrix 
     */
    multiplyWithMatrix(matrix){
        if(!this._checkMultiplyCondition(matrix) ){
            throw "Math: The given Matrix can't be multiplied because of different length properties";
        }
        const rowByColumHelper = (i,j) => {
            let resuslt = 0;
            for(let k = 0; k < this._width; ++k){
                resuslt += this._source[(this._width * i) + k] * matrix._source[ ( matrix._height * k) + j];
            }
            return resuslt;
        };
        const result = new Matrix(matrix._width, this._height);
        for(let i = 0; i < this._height; ++i){
            for(let j = 0; j < this._width; ++j){
                result._source[ (i * result._width) + j] = rowByColumHelper(i,j);
            }
        }
        return result;
    }

    toString(){
        let str = "[\n"
        let counter = 0;
        for(const val of this._source){
            
            str += val;
            if(counter === this._width-1){
                counter = 0;
                str += ",\n";
            }else{
                str += ",";
                ++counter;
            }
        }
        str += "]";
        return str;
    }

    _out(){
        console.log(this.toString());
    }
}