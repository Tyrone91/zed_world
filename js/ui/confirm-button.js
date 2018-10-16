import { ViewComponent } from "./view-component.js";

export class ConfirmButton extends ViewComponent{

    constructor(){
        super();
        this._rootElement = $("<button>").text("OK").addClass("confirm-bttn");
    }

    onclick(callback){
        this._rootElement.on("click", callback);
        return this;
    }

}