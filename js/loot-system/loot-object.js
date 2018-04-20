/**
 * Reprensentation of Loot in the game.
 * 
 */
export class LootObject{
    /**
     * 
     * @param {function} onOpen Receives the loot-object it was added to
     * @param {boolean} autoOpen 
     * @param {string} name 
     * @param {string} description
     * @param {[any]} content
     */
    constructor(onOpen, content = [], autoOpen = false, name = "NO_NAME", description = "NO_DESCRIPTION"){
        this._onOpen = onOpen || (() => {});
        this._isOpened = false;
        this._autoOpen = autoOpen;
        this._description = description;
        this._name = name;
        this._content = content;
    }

    get autoOpen(){
        return this._autoOpen;
    }

    get description(){
        return this._description;
    }

    get name(){
        return this._name;
    }

    get content(){
        return this._content;
    }

    setName(name){
        this._name = name;
        return this;
    }

    setDescription(desc){
        this._description = desc;
        return this;
    }

    setAutoOpen(open){
        this._autoOpen = open;
        return this;
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
        this._onOpen(this);
    }

    onOpen(callback){
        this._onOpen = callback;
        return this;
    }

    toString(){
        return `Loot[${this.name}]`;
    }
}