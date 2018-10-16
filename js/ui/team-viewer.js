import { ViewComponent } from "./view-component.js";
import { SurvivorListCompact } from "./survivor-list-compact.js";
import { Team } from "../mission/team.js";
import { StatsViewer } from "./stats-viewer.js";

export class TeamViewer extends ViewComponent {

    /**
     * 
     * @param {Team} team 
     */
    constructor(team) {
        super();
        this.rootElement().addClass("team-viewer flex-row");
        this._team = team;
        this._teamMemberList = new SurvivorListCompact(this._team.getTeam());
        this._teamStats = new StatsViewer(team.getAverageCombatStats());
        this._potentialMember = [];
        this.init();
    }

    init(){
        const root = this.rootElement();
        const team = this._team;
        const nameInput = $("<input>")
            .on("change", () => team.setName($(this).val() ))
            .val(team.getName());

            root
            .append(
                $("<div>").addClass("flex-column").append(
                    $("<div>").addClass("team-name").text("Name:").append(nameInput),
                    this._teamMemberList.domElement()
                )
            )
            .append( this._teamStats.domElement() );
    }

    onclick(callback){
        this._teamMemberList.onclick(callback);
        return this;
    }

    setPotentialMember(member){
        this._potentialMember = [member];
    }

    clearPotentialMember(){
        this._potentialMember = [];
    }

    update(){
        this._teamMemberList.setSurvivorlist(this._team.getTeam());
        this._teamStats.setStats(this._team.getAverageCombatStats(...this._potentialMember));
        this._teamMemberList.update();
        this._teamStats.update();
    }
}