import { ViewComponent } from "./view-component.js";
import { ActionButton } from "./action-button.js";
import { MissionList } from "./mission-list.js";

export class MissionOverview extends ViewComponent {

    constructor(){
        super();
        this.rootElement().addClass("mission-overview");
        this._missionList = new MissionList(this.game.getActiveMissions());
        this._newMissionBttn = new ActionButton("NEW");
        this._missionHistory = new ActionButton("HISTORY");

        this.init();
    }

    init(){
        const root = this.rootElement();

        const listContainer = $("<div>").addClass("list-container");

        listContainer.append(
            $("<div>").append( $("<span>").text("Active Missions") ).addClass("list-title"),
            this._missionList.domElement()
        );


        root.append(
            this._missionHistory.domElement(),
            this._newMissionBttn.domElement(),
            $("<div>").append(listContainer) 
        );
    }

    onNewMission(callback){
        this._newMissionBttn.onclick(callback);
        return this;
    }

    onMissionHistory(callback){
        this._missionHistory.onclick(callback);
        return this;
    }

    onMissionSelection(callback){
        this._missionList.onclick(callback);
    }

    update(){
        this._missionHistory.update();
        this._newMissionBttn.update();
        this._missionList.update();
    }
}