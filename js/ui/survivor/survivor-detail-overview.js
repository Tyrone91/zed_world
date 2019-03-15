import { ViewComponent } from "../view-component.js";
import { GameEnvironment } from "../../core/game-environment.js";
import { Survivor } from "../../core/survivor.js";
import { StatsViewer } from "../stats-viewer.js";

export class SurvivorDetailOverview extends ViewComponent {

    /**
     * 
     * @param {GameEnvironment} game 
     * @param {Survivor} survivor 
     */
    constructor(game, survivor) {
        super();
        this._game = game;
        this._survivor = survivor;
        this._stats = new StatsViewer(survivor.stats);
    }

    update() {
        const root = this.rootElement();
        
        this._stats.update();
    }
}