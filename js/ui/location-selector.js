import { ViewComponent } from "./view-component.js";
import { MissionMapView } from "./mission-map-view.js";
import { StatsViewer } from "./stats-viewer.js";
import { MissionParameters } from "../mission/mission-parameters.js";
import { ConfirmButton } from "./confirm-button.js";
import { TeamSelector } from "./team-selector.js";

export class LocationSelector extends ViewComponent {
     
    constructor(){
        super();
        this.rootElement().addClass("location-selector");
        
        this._missionMapView = new MissionMapView(this.game.getMissionMap());
        this._missionStats = new StatsViewer( new MissionParameters().fill(0) );
        this._locationTitle = $("<div>").addClass("location-title");
        this._confirmBttn = new ConfirmButton();
        this._confirmBttn.rootElement().hide();
        this._onLocationSelection = loc => {};
        this._selectedLocation = null;

        this._missionMapView.onclick( loc => {
            this._locationTitle.text( this.resolve(loc.name));
            this._missionStats.setStats(loc.modifiers);
            this._missionStats.update();
            this._selectedLocation = loc;
            this._confirmBttn.rootElement().show();
        });

        

        this._init();
    }

    onLocationSelection(callback){
        this._onLocationSelection = callback;
    }

    _init(){
        const root = this.rootElement();
        const statsContainer = $("<div>")
            .append(this._locationTitle, this._missionStats.domElement(), this._confirmBttn.domElement() );
        root.append(this._missionMapView.domElement(), statsContainer);
    }

    update(){
        // jquery remove clears events.
        this._confirmBttn.onclick( () => {
            this._onLocationSelection(this._selectedLocation);
        });
        this._missionMapView.update();
    }
}