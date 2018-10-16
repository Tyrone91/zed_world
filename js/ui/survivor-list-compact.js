import { ViewComponent } from "./view-component.js";
import { Survivor } from "../core/survivor.js";

export class SurvivorListCompact extends ViewComponent{

    /**
     * 
     * @param {Survivor[]} list 
     */
    constructor(list){
        super();
        this.rootElement().addClass("survivor-list-compact");
        this._survivorList = list;
        this._onEnter = s => {};
        this._onExit = s => {};
        this._onClick = s => {};
    }

    setSurvivorlist(list){
        this._survivorList = list;
        return this;
    }

    onmouseenter(callback){
        this._onEnter  = callback;
        return this;
    }

    onmouseexit(callback){
        this._onExit = callback;
        return this;
    }

    onclick(callback){
        this._onClick = callback;
        return this;
    }

    update(){
        this.clear();
        this._survivorList
            .map( surv => 
                $("<div>").addClass("survivor-entry")
                .text(surv.name() )
                .on("click", () => this._onClick(surv))
                .on("mouseenter", () => this._onEnter(surv))
                .on("mouseleave", () => this._onExit(surv))
            )
            .reduce( (prev, current) => prev.append(current), this.rootElement());
    }
}