export class Range {

    constructor(min = 0, max = 0) {
        this._min = min;
        this._max = max;
    }

    get max() {
        return this._max;
    }

    get min() {
        return this._min;
    }

    /**
     * @param {number} max
     */
    set max(max) {
        this._max = max;
    }

    /**
     * @param {number} min
     */
    set min(min) {
        this._min = min;
    }

    /**
     * 
     * @param {number} min 
     * @param {number} max 
     */
    set(min, max) {
        this.min = min;
        this.max = max;
    }
}