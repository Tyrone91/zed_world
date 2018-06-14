import * as Ajax from "../util/ajax.js";
import {ItemTemplate} from "../core/item-template.js"

export class TemplateLoader {
    constructor(path, initFile){
        this.path = path;
        this.initFile = initFile;

        /**@type {[ItemTemplate]} */
        this._loadedTemplates = [];
    }

    /**
     * 
     * @param {string[]} list
     * @returns {Promise<[ItemTemplate]>}
     */
    _collectReferences(list){
        return Ajax.getJSONAll(list, this.path, ".json")
        .then(res => {
            res.missing.forEach( url => console.warn(`reference: ${url} in ${this.initFile} couldn't be resolved`));
            return res.data;
        });
    }

    _fetchList(){
        return Ajax.getJSON(this.path + "template/" + this.initFile)
        .then(
            list => this._collectReferences(list),
            () =>  {console.warn("loot definition couldn't be found"); return []});
    }

    load(){
        return this._fetchList()
        .then( res => {
            this._loadedTemplates = res;
            return res;
        });
    }

    /**
     * Returns an item with the id or null
     * @param {string} name 
     */
    getTemplate(name){
        const res = this._loadedTemplates.find( item => item.referenceId === name) || null;
        return res;
    }

    getAllTemplates(){
        return this._loadedTemplates;
    }
}