import { Position } from "../util/position.js";
import { Location } from "../mission-v2/location.js";
import { MissionParameters } from "../mission/mission-parameters.js";
import { ArrayGrid } from "../util/array-grid.js";

export class World {

    /**
     * 
     * @param  {...Location} locations 
     */
    constructor(...locations) {
        this._width = 0;
        this._height = 0;
        this._locations = new ArrayGrid(this._width, this._height);
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }
    
    get locations() {
        return this._locations.raw;
    }

    /**
     * 
     * @param {Position} position 
     */
    get(position) {
        return this._locations.get(position.x, position.y);
    }

    /**
     * 
     * @param {Position} position 
     * @param {Location} location 
     */
    set(position, location) {
        this._locations.set( position.x, position.y, location);
    }

    forEach(callback) {
        this._locations.forEach(callback);
    }

    /**
     * 
     * @param {Location[]} locations 
     */
    _findBounds(locations) {
        const w = [...locations].sort( (a,b) => a.position.x - b.position.x )[0];
        const h = [...locations].sort( (a,b) => a.position.y - b.position.y )[0];
        return {
            width: w.position.x + 1,
            height: h.position.y + 1
        };
    }

    /**
     * 
     * @param {Location[]} locations 
     */
    _updateBounds(locations) {
        const bounds = this._findBounds(locations);
        this._width = bounds.width;
        this._height = bounds.height;

        this._locations = new ArrayGrid(this._width, this._height);
        this._locations.for

        const outer = new Array(this._width);

        for(let y = 0; y < this._height; ++y) { //TODO: rework and use NON-Null pattern.
            const inner = [];
            for(let x = 0; x < this._width; ++x) {
                const loc = locations.find( l => Position.matches(l.position, Position.of(x,y)) ) || this.createFallbackLocation(x,y);
                outer.push(loc);
            }
            outer.push(ou)
        } 
    }

    createFallbackLocation(x,y) {
        const l = new Location("EMPTY", "NOTHING HERE", new MissionParameters(), Position.of(x,y));
        l.lockLocation(true);
        return l;
    }

}