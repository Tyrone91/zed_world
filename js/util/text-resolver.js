import { getJSON } from "./ajax.js";

export class TextResolver {

    constructor(){
        this._texts = new Map();
        this._notFound = new Set();
    }

    load(file){
        return getJSON("data/text/" + file)
        .then( data => {
            Object.keys(data).forEach( key => {
                const value = data[key];
                this._texts.set(key,value);
            });
        });
    }

    resolve(key){
        if(this._texts.has(key)){
            return this._texts.get(key);
        }
        this._notFound.add(key);
        localStorage.setItem("NOT_FOUND_TEXT", JSON.stringify([...this._notFound]));
        return key;
    }
}