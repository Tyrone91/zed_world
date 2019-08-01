export class Character {
    constructor(){
        this._name = "";
    }

    name(newName){
        if(!newName){
            return this._name;
        }
        this._name = newName;
        return this;
    }
}