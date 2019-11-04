export class Position {

    constructor(x = 0, y = 0) {
        this._x = x;
        this._y =y;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    /**
     * Returns a new Position-Object with the same values as the orginal added with the given offset.
     * 
     * @param {number} offsetX 
     * @param {number} offsetY 
     */
    clone(offsetX = 0, offsetY = 0) {
        return new Position(this.x + offsetX, this.y + offsetY);
    }

    static of(x = 0, y = 0) {
        return new Position(x,y);
    }

    /**
     * Checks if the given positions are equal
     * @param {Position} pos1 
     * @param {Position} pos2 
     */
    static matches(pos1, pos2) {
        return pos1.x === pos2.x && pos1.y === pos2.y;
    }
}