import { ViewComponent } from "./view-component.js";
import { Combat } from "../combat/combat.js";
import { SurvivorImage } from "./survivor/survivor-image.js";
import { ActionButton } from "./action-button.js";
import { Round } from "../combat/round.js";
import { CombatAction, AttackAction } from "../combat/combat-action.js";

export class BattleReportView extends ViewComponent {

    /**
     * 
     * @param {Combat} combat 
     */
    constructor(combat, date = 0){
        super();
        this.rootElement().addClass("battle-report");
        this._combat = combat;
        this._expandContainer = $("<div>").addClass("expandable-container");
        this._timeOfCombat = date;

        this.init();
    }

    /**
     * 
     * @param {CombatAction} action
     */
    _buildRoundDetails(action) {
        const container = $("<div>").addClass("round-detail-entry");
        
        const targetName = action.target.getName();
        const executorName = action.executor.getName();

        container.append(
            $("<span>").text(executorName),
            $("<span>").text( this.resolve(action.type)),
            $("<span>").text(targetName)
        );

        if(action.type === AttackAction.Type){
            const a = /**@type {AttackAction} */(action);
            container.append(
                $("<span>").text( a.hit ? this.resolve("TARGET_HIT") : this.resolve("TARGET_MISSED")),

                $("<span>").text( this.resolve("HIT_CHANCE")),
                $("<span>").text(a.hitchance),

                $("<span>").text( this.resolve("DAMAGE_INFLICTED")),
                $("<span>").text(a.inflictedDamage)
            );
        }

        return container;
    }

    /**
     * 
     * @param {Round} round 
     */
    _buildRoudEntry(round){
        const container = $("<div>").addClass("round-container");
        const detailContainer = $("<div>").addClass("round-details");
        let detailShowing = false;
        const infoBar = $("<div>").addClass("round-summary")
            .append(
                $("<span>").text("Dist:" + round.distance),
                $("<span>").text("Round:" + round.number),
                $("<button>").text("details").on("click", e => {
                    detailContainer.empty();
                    if(detailShowing) {

                    } else {
                        round.getActions().map(a => this._buildRoundDetails(a)).forEach( e => detailContainer.append(e));
                    }
                    detailShowing = !detailShowing;
                })
            );

        const fallen = round.getKilledSurvivors().map( s => new SurvivorImage(s).domElement());

        const killed = $("<div>").append(
            $("<span>").text(this.resolve("KILLED")),
            $("<span>").text(round.getKilledEnemies().length) );

        
        return container.append(fallen, killed, infoBar, detailContainer);
    }

    _buildRoundContainer(){
        this._combat.rounds()
        .map( r => this._buildRoudEntry(r) )
        .forEach( e => this._expandContainer.append(e));
    }

    init(){
        const root = this.rootElement();
        const combat = this._combat;
        const fallenSurvivors = combat.rounds().map( r => r.getKilledSurvivors()).reduce( (prev, cur) => prev.concat(cur), [] );

        const fallenElement = fallenSurvivors
            .map( s => new SurvivorImage(s,50,50))
            .reduce( (prev, cur) => prev.append(cur.domElement()) , $("<div>"))
            .addClass("fallen-list-round");

        let roundVisible = false;
        const infoBar = $("<div>").addClass("info-bar");
        const expandBttn = new ActionButton("+").onclick( () => {
            this._expandContainer.empty();
            if(!roundVisible) {
                expandBttn.rootElement().text("-");
                this._buildRoundContainer();
            } else {
                expandBttn.rootElement().text("+");
            }
            roundVisible = !roundVisible;
            
        });
        expandBttn.domElement().addClass("expand-round-bttn");
        infoBar.append(
            $("<div>").text(`${this.resolve("BATTLE_REPORT_DAY")} ${this._timeOfCombat + 1}: ${combat.enemiesKilled()} Zed killed`),
            fallenElement,
            expandBttn.domElement()
            );

        root.append(infoBar, this._expandContainer);
        
    }

    update(){

    }
}