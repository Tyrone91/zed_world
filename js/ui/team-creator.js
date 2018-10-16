import { ViewComponent } from "./view-component.js";
import { Team } from "../mission/team.js";
import { SurvivorListCompact } from "./survivor-list-compact.js";
import { TeamViewer } from "./team-viewer.js";
import { ConfirmButton } from "./confirm-button.js";

export class TeamCreator extends ViewComponent {

    constructor( team = new Team("New Team") ){
        super();
        this.rootElement().addClass("team-creator");
        this._team = team;
        this._available = this.game.getAvailableSurvivors();
        this._availableSurvivorList = new SurvivorListCompact(this._available);
        this._teamViewer = new TeamViewer(this._team);
        this._onNewTeam = team => {};
        this._confirmButton = new ConfirmButton();

        this._availableSurvivorList
            .onmouseenter( surv => {
                this._teamViewer.setPotentialMember(surv);
                this._teamViewer.update();
            })
            .onmouseexit( surv => {
                this._teamViewer.clearPotentialMember();
                this._teamViewer.update();
            })
            .onclick( surv => {
                const i = this._available.indexOf(surv);
                this._available.splice(i,1);
                this._team.addTeamMember(surv);
                this._teamViewer.update();
                this._availableSurvivorList.update();
            });

        this._teamViewer.onclick( surv => {
            this._team.removeMember(surv);
            this._available.push(surv);
            this._teamViewer.update();
            this._availableSurvivorList.update();
        });
        this.init();
    }

    onNewTeam(callback){
        this._onNewTeam = callback;
    }

    init(){
        const root = this.rootElement();

        root
            .append(
                $("<div>").addClass("available-survivors").append(
                    $("<div>").addClass("list-title").text("Available"),
                    this._availableSurvivorList.domElement()
                ),
                this._teamViewer.domElement(),
                this._confirmButton.domElement()
            );
    }

    update(){
        this._confirmButton.onclick( () => {
            this._onNewTeam(this._team);
        });
        this._availableSurvivorList.update();
        this._teamViewer.update();
    }
}