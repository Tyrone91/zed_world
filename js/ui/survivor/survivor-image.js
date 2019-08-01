import { ViewComponent } from "../view-component.js";
import { Survivor } from "../../core/character/survivor.js";

export class SurvivorImage extends ViewComponent {

    /**
     * 
     * @param {Survivor} survivor 
     */
    constructor(survivor, width = 50, height = 50){
        super();
        this.rootElement().addClass("survivor-image");
        this._survivor = survivor;
        this._canvas = document.createElement("canvas");
        this._image = this.resolveImg("portraits", survivor.portrait);
        this._width = width;
        this._heigt = height;
        this._image.addEventListener("load",e => { // because the img is loaded async it is possible that it not there yet. Update the component if something changes.
            this.update();
        });
    }

    width(w) {
        this._width = w;
    }

    height(h) {
        this._heigt = h;
    }

    update(){
        this.clear();
        const root = this.rootElement();
        const width = this._width;
        const height = this._heigt;

        this._canvas.width = width;
        this._canvas.height = height;
        const context = this._canvas.getContext("2d");

        context.fillStyle = "#775533";
        context.fillRect(0,0,width, height);
        context.drawImage(this._image,0,0,width,height);

        if(!this._survivor.isAlive()){
            context.beginPath();
            context.strokeStyle = "red";
            context.lineWidth = 2;
            context.moveTo(0,0);
            context.lineTo(width,height);
            context.moveTo(width,0);
            context.lineTo(0, height);
            context.stroke();
            context.closePath();
        }

        root.append(this._canvas);
    }
}