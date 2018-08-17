import * as AJAX from "../../js/util/ajax.js"
import {Equipment} from "../../js/equipment/equipment.js";

export class Importer {
    constructor(path){
        this._weaponlist = path;
    }

    /**
     * @returns {Promise<Equipment[]>}
     */
    import(){
        return AJAX.getJSON(this._weaponlist)
        .then( data => {
            return AJAX.getJSONAll(data);
        })
        .then( (weapons, missing) => {
            return weapons;
        });
    }
}