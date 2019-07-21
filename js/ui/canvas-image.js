import { ViewComponent } from "./view-component.js";

export class CanvasImage extends ViewComponent {

    /**
     * 
     * @param {string} imageName 
     */
    constructor(imageName, path = "") {
        super();
        this._img = this.resolveImg(path , imageName);
        this._img.addEventListener("load", e => {
            this.update();
        });
        this._width = 80;
        this._height = 120;
        this._canvas = document.createElement("canvas");

        const root = this.rootElement();
        root.append(this._canvas);

    }

    get canvas() {
        return this._canvas;
    }

    get context() {
        return this._canvas.getContext("2d");
    }

    /**
     * @param {number} width
     */
    set width(width) {
        this._width = width;
        this._canvas.width = width;
    }

    /**
     * @param {number} height;
     */
    set height(height) {
        this._height = height;
        this._canvas.height = height;
    }

    _drawNotFound() {
        const ctx = this.context;
        const w = this._width;
        const h = this._height;

        ctx.fillStyle = "#ff0099";
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = "#000000";
        

        const WANTED_W_SIZE = 15;
        const WANTED_H_SIZE = 15;

        const maxW = Math.floor(w / WANTED_W_SIZE);
        const maxH = Math.floor(h / WANTED_H_SIZE);

        const cw = Math.round(w / maxW);
        const ch = Math.round(h / maxH);

        let pink = false;
        let firstIsPink = pink; 
        for(let y = 0; y < h; y += ch) {
            for(let x = 0; x < w; x += cw) {
                ctx.fillStyle = pink ? "#ff0099" : "#000000";
                pink = !pink;
                ctx.fillRect(x, y, cw, ch);
            }
            pink = !firstIsPink;
            firstIsPink = !firstIsPink;
        }
    }

    update() {

        const ctx = this.context;
        const w = this._width;
        const h = this._height;

        ctx.fillStyle = "#ff0099";
        ctx.fillRect(0, 0, w, h);

        this._drawNotFound();
        ctx.drawImage(this._img, 0, 0, w, h);
        
    }
}