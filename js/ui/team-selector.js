import { ViewComponent } from "./view-component.js";
import { TeamCreator } from "./team-creator.js";
import { ConfirmButton } from "./confirm-button.js";

export class TeamSelector extends ViewComponent {
    constructor(){
        super();
        this._teamCreator = new TeamCreator();
        this._onTeamSelected = team => {};
        this._selectedTeam = null;
        this._confirmBttn = new ConfirmButton();
        this._confirmBttn.rootElement().prop("disable", true)

        this._teamCreator.onNewTeam( team => {
            this._selectedTeam = team;
            this._confirmBttn.rootElement().prop("disable", false);
        });

        this._confirmBttn.onclick( () => {
            this._onTeamSelected(this._selectedTeam);
        });

        this.init();
    }

    init(){
        const root = this.rootElement();
        root.append(this._teamCreator.domElement(), this._confirmBttn.domElement());
    }

    onTeamSelected(callback){
        this._onTeamSelected = callback;
    }

    update(){

        
        this._teamCreator.update();
    }
}
