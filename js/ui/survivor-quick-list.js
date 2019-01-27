import { ViewComponent } from "./view-component.js";
import { Survivor } from "../core/survivor.js";
import { SurvivorImage } from "./survivor-image.js";
import { GameEnvironment } from "../core/game-environment.js";

export class SurvivorQuickList extends ViewComponent {

    /**
     * 
     * @param {GameEnvironment} game 
     */
    constructor(game) {
        super();

        this._game = game;
    }

    /**
     * 
     * @param {Survivor} survivor 
     */
    _panel(survivor) {
        const res = $("<div>").addClass("survivor-quick-entry flex-row");

        const portrait = new SurvivorImage(survivor);

        const text = $("<span>").text(survivor.name() + ": " + this.resolve(survivor.state));

        res.on("click", e => {
            this.manager.setContent( () => {
                //TODO: Surivovr overview.
            });
        });
        return res.append(portrait.domElement(), text);
    }

    update() {
        const root = this.rootElement();
        root.addClass("flex-column");
        root.empty();
        console.log(this._game.getAllAliveSurivors());
        this._game.getAllAliveSurivors()
            .map( s => this._panel(s))
            .forEach( e => {
                root.append(e);
            });
    }
}