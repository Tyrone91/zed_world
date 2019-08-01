import { ViewComponent } from "../view-component.js";
import { Survivor } from "../../core/character/survivor.js";

export class SurvivorListDetail extends ViewComponent {

    /**
     * 
     * @param {Survivor[]} list 
     */
    constructor(list){
        super();
        this._survivors = list;
        this._onSelection = s => {};
    }

    /**
     * 
     * @param {Survivor} survivor 
     */
    _survivorEntry(survivor){
        const container = $("<div>");

        container.append(
            /** @type {string} */(survivor.name()),
            survivor.state
        );
        return container;
    }

    setSurvivors(list){
        this._survivors = list;
    }

    onclick(callback){
        this._onSelection = callback;
    }

    update(){
        const root = this.rootElement();

        this._survivors
            .map( s => this._survivorEntry(s))
            .reduce( (prev, cur) => prev.append(cur), root );
    }
}