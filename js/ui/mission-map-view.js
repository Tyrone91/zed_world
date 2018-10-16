import { ViewComponent } from "./view-component.js";
import { MissionMap } from "../mission/mission-map.js";
import { Location } from "../mission/location.js";

export class MissionMapView extends ViewComponent {

    /**
     * 
     * @param {MissionMap} source 
     */
    constructor(source){
        super();
        this.rootElement().addClass("mission-map");
        this._source = source;
        this._locationCallback = (l,x,y) => {};
    }

    /**
     * 
     * @param {(location:Location, x:number, y:number)=>void} callback 
     */
    onclick(callback){
        this._locationCallback = callback;
        return this;
    }

    update(){
        this.clear();
        const root = this.rootElement();
        const map = this._source;
        let currentY = 0;
        let currentRow = $("<div>");
        map.forEach( (entry,x,y) => {
            if(y !== currentY){
                currentY = y;
                root.append(currentRow);
                currentRow = $("<div>");
            }
            currentRow.append(
                $("<div>")
                    .addClass("mission-map-entry")
                    .data("x",x)
                    .data("y",y)
                    .text(entry.name)
                    .click( () => this._locationCallback(entry, x, y) )
            )
        });
    }

}