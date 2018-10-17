import { ViewComponent } from "./view-component.js";
import { MissionMapView } from "./mission-map-view.js";
import { StatsViewer } from "./stats-viewer.js";
import { MissionParameters } from "../mission/mission-parameters.js";
import { ConfirmButton } from "./confirm-button.js";
import { TeamSelector } from "./team-selector.js";
import { MissionBuilder } from "../mission/mission-builder.js";
import { LocationSelector } from "./location-selector.js";
import { TeamCreator } from "./team-creator.js";
import { TeamViewer } from "./team-viewer.js";
import { SurvivorMission } from "../mission/survivor-mission.js";

export class MissionSummary extends ViewComponent {
     
    /**
     * 
     * @param {SurvivorMission} mission 
     */
    constructor(mission){
        super();
        this.rootElement().addClass("mission-summary flex-column");
        this._teamList = new TeamViewer(mission.getTeams()[0]);
        this._locationStats = new StatsViewer(mission.getTargetLocation().modifiers);
        this._overallMissionStats = new StatsViewer(mission.modifier);
        this._missionLengthLabel = $("<span>").text(mission.getMissionLength());
        this._missionStateLabel = $("<span>").text( this.resolve(mission.getMissionState()));
        this._locationNameLabel = $("<span>").text( this.resolve(mission.getTargetLocation().name));
        this._mission = mission;
        this._confirmButton = new ConfirmButton();
        this._onConfirmation = () => {};

        this._init();
    }

    /**
     * 
     * @param {SurvivorMission} mission 
     */
    setMission(mission){
        this._mission = mission;
        this._teamList.setTeam(mission.getTeams()[0]);
        this._locationStats.setStats(mission.getTargetLocation().modifiers);
        this._overallMissionStats.setStats(mission.modifier);
    }

    onconfirmation(callback){
        this._onConfirmation = callback;
        this._confirmButton.onclick( () => {
            this._onConfirmation();
        });
    }

    _init(){
        const root = this.rootElement();

        const teamPanel = $("<div>")
            .append( $("<div>").append("<span>").text( this.resolve("Team")) )
            .append( this._teamList.domElement() );

        const locationPanel = $("<div>")
            .append( $("<div>").append( this._locationNameLabel ))
            .append( this._locationStats.domElement() );

        const missionPanel = $("<div>")
            .append( $("<div>").text("State: ").append(this._missionStateLabel) )
            .append( $("<div>").text("Length: ").append(this._missionLengthLabel) )
            .append( this._overallMissionStats.domElement() );

        root.append(
            $("<div>").addClass("flex-row").append(teamPanel, locationPanel),
            $("<div>").addClass("flex-row").append(missionPanel),
            $("<div>").addClass("flex-row").append(this._confirmButton.domElement())
        );
    }

    update(){
        this._locationNameLabel.text( this.resolve(this._mission.getTargetLocation().name));
        this._missionLengthLabel.text(this._mission.getMissionLength());
        this._missionStateLabel.text( this.resolve(this._mission.getMissionState()));
        this._teamList.update();
        this._locationStats.update();
        this._overallMissionStats.update();
        
        
    }
}