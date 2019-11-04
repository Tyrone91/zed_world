import { isFunction } from "./predicate.js";
import { Position } from "./position.js";


/**
 * @template T The type of the data.
 */
export class ArrayGrid {

    /**
     * 
     * @param {number} width 
     * @param {number} height 
     */
    constructor(width, height) {
        this._width = width;
        this._height = height;

        /**@type {T[]} */
        this._data = new Array(width * height);
        this[Symbol.iterator] = this.iterator;

        /**@type {Map<string, {arg: boolean}>} */
        const map = new Map();
        const array = [...map];
        
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get raw() {
        return this._data;
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    get(x,y) {
        return this._data[this._indexOf(x,y)];
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {T} data 
     */
    set(x,y, data) {
        this._data[this._indexOf(x,y)] = data;
    }

    /**
     * 
     * @param {T|( (data:T, x:number, y:number) => T )} value 
     */
    fill(value) {
        if(isFunction(value)) {
            const func = /**@type {(data:T, x:number, y:number) => T} */ (value);
            this.forEach( (data, x, y) => {
                this.set(x, y, func(data, x, y) );
            });
        } else { //assume value
            const val = /**@type {T} */ (value);
            this.forEach( (_,x,y) => this.set(x,y, val) );
        }   
    }

    /**
     * 
     * @param { (data:T, x:number, y:number) => void } callback 
     */
    forEach(callback) {
        for(let y = 0; y < this.height; ++y) {
            for(let x = 0; x < this.width; ++x) {
                const data = this.get(x,y);
                callback(data, x, y);
            }
        }
    }

    /**
     * Maps all objects in the source ArrayGrid into a new one.
     * @template N
     * @param { (data:T, x: number, y:number) => N } callback 
     */
    map(callback) {
        /**@type {ArrayGrid<N>} */
        const newGrid = new ArrayGrid(this.width, this.height);
        this.forEach( (data,x,y) => newGrid.set(x,y, callback(data,x,y)) );
        return newGrid;
    }

    /**
     * Returns a new ArrayGrid with the same content.
     * Note: only the ArrayGrid itself is cloned not it's content.
     * @returns {ArrayGrid<T>}
     */
    clone() {
        const copy = new ArrayGrid(this.width, this.height);
        this.forEach( (data,x,y) => copy.set(x,y, data) );
        return copy;
    }

     *iterator() {
        const grid = this;
        for(let i = 0; i < this._data.length; ++i) {
            const pos = grid._toPosition(i);
            const val = grid._data[i];

            yield {
                value: val,
                x: pos.x,
                y: pos.y
            };
        }
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    _indexOf( x, y) {
        return this.width * y + x;
    }

    _toPosition(index) {
        const y = Math.floor(index / this._width);
        return Position.of(index  - (this._width * y)  ,y);
    }
}