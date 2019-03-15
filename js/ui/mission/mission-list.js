import { ViewComponent } from "../view-component.js";
import { SurvivorMission } from "../../mission/survivor-mission.js";

export class MissionList extends ViewComponent {

    /**
     * 
     * @param {SurvivorMission[]} missionlist 
     */
    constructor(missionlist){
        super();
        this.rootElement().addClass("mission-list");
        this._missionList = missionlist;
        this._onMissionSelection = m => {};
    }

    /**
     * 
     * @param {SurvivorMission} mission 
     */
    _missionPanel(mission){
        const container = $("<div>").addClass("mission-entry");
        container.on("click", () => this._onMissionSelection(mission));
        //TODO: add location as background.
        const teamName = $("<div>").addClass("team-label").text(mission.getTeams().map(t => t.getName()).join(",") );
        const stateLabel = $("<div>").addClass("state-label").text( this.resolve(mission.getMissionState()));
        const lengthLabel = $("<div>").addClass("length-label").text(mission.timeLeft() + "/" + mission.getMissionLength() );
        const locationLabel = $("<div>").addClass("location-label").text( this.resolve(mission.getTargetLocation().name));
        return container.append(teamName, stateLabel, lengthLabel, locationLabel);
    }

    /**
     * 
     * @param {(mission:SurvivorMission)=>void} callback 
     */
    onclick(callback){
        this._onMissionSelection = callback;
        return this;
    }

    update(){
        this.clear();
        const root = this.rootElement();
        this._missionList
            .map( m => this._missionPanel(m) )
            .reduce( (prev,cur) => prev.append(cur), root );
        
    }
}