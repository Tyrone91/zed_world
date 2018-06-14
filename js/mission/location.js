import { MissionParameters } from "./mission-parameters.js";

export class Location{

    constructor(name = "", description = ""){
        this._name = name;
        this._description = description;
        this._modifiers = new MissionParameters().fill(1);
    }

    get name(){
        return this._name;
    }

    get description(){
        return this._description
    }

    get modifiers(){
        return this._modifiers;
    }

    setName(newName){
        this._name = newName;
        return this;
    }

    setDescription(desc){
        this._description = desc;
        return this;
    }
}


