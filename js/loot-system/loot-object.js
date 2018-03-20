/**
 * Reprensentation of Loot in the game.
 * 
 */
export class LootObject{
    /**
     * 
     * @param {function} onOpen 
     * @param {boolean} autoOpen 
     * @param {string} name 
     * @param {string} description 
     */
    constructor(onOpen, autoOpen = false, name = "NO_NAME", description = "NO_DESCRIPTION"){
        this._onOpen = () => {};
        this._isOpened = false;
        this._autoOpen = autoOpen;
        this._description = description;
        this._name = name;
    }

    get autoOpen(){
        return this._autoOpen;
    }

    get description(){
        return this._description;
    }

    name(){
        return this._name;
    }

    /**
     * Indicates that the loot object is alreay opened
     * @returns {boolean} True if opened
     */
    isOpened(){
        return this._isOpened;
    }

    open(){
        this._isOpened = true;
        this._onOpen();
    }

    onOpen(callback){
        this._onOpen = callback;
        return this;
    }
}