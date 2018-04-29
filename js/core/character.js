export class Character {
    constructor(){
        this._name = "";
    }

    get name(){
        return this._name;
    }

    name(newName){
        this._name = newName;
        return this;
    }
}