import { ViewComponent } from "../view-component.js";
import { SurvivorListCompact } from "../survivor/survivor-list-compact.js";
import { Team } from "../../mission/team.js";
import { StatsViewer } from "../stats-viewer.js";

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
        this._nameInput = $("<input>");
        this.init();

        this._nameInput.on("input", () => this._team.setName( $(this._nameInput).val() ))
    }

    init(){
        const root = this.rootElement();
        const team = this._team;
        this._nameInput = $("<input>")
            
            root
            .append(
                $("<div>").addClass("flex-column").append(
                    $("<div>").addClass("team-name").text( this.resolve("Name") + ":").append(this._nameInput),
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

    setTeam(team){
        this._team = team;
    }

    update(){
        
        this._nameInput.val(this._team.getName());
        this._teamMemberList.setSurvivorlist(this._team.getTeam());
        this._teamStats.setStats(this._team.getAverageCombatStats(...this._potentialMember));
        this._teamMemberList.update();
        this._teamStats.update();
    }
}