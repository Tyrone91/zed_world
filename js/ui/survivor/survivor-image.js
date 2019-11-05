import { ViewComponent } from "../view-component.js";
import { Survivor } from "../../core/character/survivor.js";
import { CanvasImage } from "../canvas-image.js";

export class SurvivorImage extends ViewComponent {

    /**
     * 
     * @param {Survivor} survivor 
     */
    constructor(survivor, width = 50, height = 50) {
        super();
        this.rootElement().addClass("survivor-image");
        this._survivor = survivor;
        this._canvas = document.createElement("canvas");
        this._image = new CanvasImage(survivor.portrait, "portraits");
        //this._image = this.resolveImg("portraits", survivor.portrait);
        this._width = width;
        this._heigt = height;
    }

    width(w) {
        this._width = w;
    }

    height(h) {
        this._heigt = h;
    }

    update() {
        this.clear();
        const root = this.rootElement();
        const width = this._width;
        const height = this._heigt;

        this._image.width = width;
        this._image.height = height;
        this._image.update();
        const context = this._image.context;

        if (!this._survivor.isAlive()) {
            context.beginPath();
            context.strokeStyle = "red";
            context.lineWidth = 2;
            context.moveTo(0, 0);
            context.lineTo(width, height);
            context.moveTo(width, 0);
            context.lineTo(0, height);
            context.stroke();
            context.closePath();
        }

        root.append(this._image.element);
    }
}