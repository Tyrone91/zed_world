export class LootWrapper {

    /**
     * 
     * @param {string} type 
     * @param {number} weight 
     * @param {string} contentDesc 
     * @param {...any} content 
     */
    constructor(type, weight, contentDesc, ...content){
        this._type = type;
        this._weight = weight;
        this._conetnDesc = contentDesc;
        this._content = content;
    }

    get weight(){
        return this._weight;
    }

    get type(){
        return this._type;
    }

    get content(){
        return this._content;
    }

    get contentDescription(){
        return this._conetnDesc;
    }
}