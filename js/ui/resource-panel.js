import { ViewComponent } from "./view-component.js";
import { Resource } from "../loot-system-v3/resources.js";

export class ResourcePanel extends ViewComponent {

    /**
     * 
     * @param {Resource} source 
     */
    constructor(source){
        super();
        this.rootElement().addClass("resource-panel");
        this._source = source;

        this._resourceValueLabel = $("<span>");
        this.init();
    }

    init(){
        const root = this.rootElement();
        root
            .append( $("<span>").text( this.resolve(this._source.type) ))
            .append( this._resourceValueLabel);
    }

    update(){
        this._resourceValueLabel.text(this._source.amout);
    }
}