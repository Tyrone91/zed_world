import { ViewComponent } from "./view-component.js";
import { MissionMapView } from "./mission-map-view.js";
import { StatsViewer } from "./stats-viewer.js";
import { MissionParameters } from "../mission/mission-parameters.js";
import { ConfirmButton } from "./confirm-button.js";
import { TeamSelector } from "./team-selector.js";
import { MissionBuilder } from "../mission/mission-builder.js";
import { LocationSelector } from "./location-selector.js";
import { TeamCreator } from "./team-creator.js";

export class MissionSummary extends ViewComponent {
     
    constructor(){
        super();
        this.rootElement().addClass("mission-summary");
        
        this._confirmButton = new ConfirmButton();
        this._onConfirmation = () => {};

        this._init();
    }

    onconfirmation(callback){
        this._onConfirmation = callback;
    }

    _init(){
        const root = this.rootElement();
        root.append(
            this._confirmButton.domElement()
        );
    }

    update(){
        
        this._confirmButton.onclick( () => {
            this._onConfirmation();
        });
    }
}