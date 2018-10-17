import { ViewComponent } from "./view-component.js";

export class ActionButton extends ViewComponent {
    constructor(text){
        super();
        this._rootElement = $("<button>").text( this.resolve(text)).addClass("action-button");
        this._callback = () => {};
    }

    onclick(callback){
        this._callback = callback;
        this._rootElement.on("click", this._callback);
        return this;
    }

    update(){
    }
}