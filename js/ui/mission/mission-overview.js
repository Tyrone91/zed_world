import { ViewComponent } from "../view-component.js";
import { ActionButton } from "../action-button.js";
import { MissionList } from "./mission-list.js";

export class MissionOverview extends ViewComponent {

    constructor(){
        super();
        this.rootElement().addClass("mission-overview");
        this._missionList = new MissionList(this.game.getActiveMissions());
        this._newMissionBttn = new ActionButton("NEW");
        this._missionHistory = new ActionButton("HISTORY");
        this._createTeam = new ActionButton("CREATE_TEAM");
        this._viewTeams = new ActionButton("VIEW_TEAMS");

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
            this._createTeam.domElement(),
            this._viewTeams.domElement(),
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
        return this;
    }

    onCreateNewTeam(callback){
        this._createTeam.onclick(callback);
        return this;
    }

    onViewTeams(callback){
        this._viewTeams.onclick(callback);
        return this;
    }

    update(){
        this._missionList.update();
        this._missionHistory.update();
        this._newMissionBttn.update();
        this._createTeam.update();
        this._viewTeams.update();
    }
}