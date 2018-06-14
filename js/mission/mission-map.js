import { Location } from "./location.js";

export class PresetEntry{

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {Location} location 
     */
    constructor(x,y, location){
        this.x = x;
        this.y = y;
        this.location = location;
    }
}

export class MissionMap {

    /**
     * 
     * @param {number} width 
     * @param {number} height
     * @param {PresetEntry[]=} presets
     */
    constructor(width, height, presets){
        this._width = width;
        this._height = height;
        this._map = this._initMap(width, height);
        this._fillMap(presets);
    }

    /**
     * @param {PresetEntry[]} preset
     */
    _fillMap(preset){
        if(!preset){
            return;
        }
        preset.forEach( entry => {
            this.setPosition(entry.x, entry.y, entry.location);
        });
    }

    _isValidAccess(x,y){
        return this.width > x && this.height > y && x >= 0 && y >= 0;
    }

    _accessCheck(x,y){
        if(this._isValidAccess(x,y)){
            return;
        }
        throw `MissionMap: x:${x} y:${y} is not in bounds of width:${this.width} and height:${this.height}`; 
    }

    /**
     * @param {number} width 
     * @param {number} height
     */
    _initMap(width, height){
        const raw = [];
        for(let i = 0; i < width * height; ++i){
            raw.push(new Location());
        }
        return raw;
    }

    /**
     * @param {number} x 
     * @param {number} y 
     */
    _pointToIndex(x,y){
        this._accessCheck(x,y);
        return this._width * y + x;
    }

    /**
     * @param {number} x 
     * @param {number} y 
     */
    getPosition(x,y){
        return this._map[this._pointToIndex(x,y)];
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {Location} location 
     */
    setPosition(x,y, location){
        this._map[this._pointToIndex(x,y)] = location;
        return this;
    }

    forEach(callback){
        for(let y = 0; y < this._height; ++y){
            for(let x = 0; x < this._width; ++x){
                callback(this.getPosition(x,y), x, y);
            }
        }
    }

    /**
     * 
     * @param {PresetEntry[]} presets 
     */
    setLocations(presets){
        this._fillMap(presets);
        return this;
    }

    get width(){
        return this._width;
    }

    get height(){
        return this._height;
    }
}