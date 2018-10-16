import { ViewComponent } from "./view-component.js";

export class CancelButton extends ViewComponent {

    constructor(){
        super();
        this._rootElement = $("<button>").text("CANCEL").addClass("cancel-bttn");
    }

    onclick(callback){
        this._rootElement.on("click", callback);
        return this;
    }

}