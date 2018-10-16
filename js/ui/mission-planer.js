import { ViewComponent } from "./view-component.js";
import { MissionMapView } from "./mission-map-view.js";
import { StatsViewer } from "./stats-viewer.js";
import { MissionParameters } from "../mission/mission-parameters.js";
import { ConfirmButton } from "./confirm-button.js";
import { TeamSelector } from "./team-selector.js";
import { MissionBuilder } from "../mission/mission-builder.js";
import { LocationSelector } from "./location-selector.js";
import { TeamCreator } from "./team-creator.js";

export class MissionPlaner extends ViewComponent {
     
    constructor(){
        super();
        this.rootElement().addClass("mission-planer");
        this._missionBuilder = this.game.createDefaultMissionBuilder();
        this._locationSelector = new LocationSelector();
        this._teamSelector = new TeamSelector();
        this._confirmButton = new ConfirmButton();
        

        this._locationSelector.onLocationSelection( loc => {
            this._missionBuilder.setTarget(loc);
            this.manager.pushContent( () => this._teamSelector.domElement() );
        });

        this._teamSelector.onTeamSelected( team => {
            this._missionBuilder.setTeams([team]);
            this.manager.pushContent( () => this.domElement() );
        });

        this._init();
    }

    _init(){
        
        this.manager.setContent( () => this._locationSelector.domElement());
        const root = this.rootElement();
        root.append(
            this._confirmButton.domElement()
        );
    }

    update(){
        
        this._confirmButton.onclick( () => {
            const mission = this._missionBuilder.build();
            this.game.addNewMission(mission);
        });
    }
}