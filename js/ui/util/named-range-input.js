import { ViewComponent } from "../view-component.js";
 
export class NamedRangeInput extends ViewComponent {
    
    constructor(name, min = 0, max = 100, lower = 25, upper = 75) {
        super();
        this._lower = lower;
        this._upper = upper;
        this._leftHandle = $("<span>").addClass("handle left");
        this._rightHandle = $("<span>").addClass("handle left");

        this._init();
        this.clazz("named-range-input");

    }


    _init() {
        const container = $("<div>").addClass("range-container");

        let dragLeft = false;
        let dragRight = false;
        let dragStartX = -1;

        $(container).on("mousedown", e => {
            dragStartX = e.offsetX;
        });

        $(container).on("mouseleave", e => {
            dragLeft = false;
            dragRight = false;
        });

        $(this._leftHandle).on("mousedown", e => {
            dragLeft = true;
        });

        $(this._rightHandle).on("mousedown", e => {
            dragRight = true;
        });

        $(this._leftHandle).on("mouseup", e => {
            dragLeft = false;
        });

        $(this._rightHandle).on("mouseup", e => {
            dragRight = false;
        });

        $(container).on("mousemove", e => {
            console.log("move");
            if(!dragLeft && !dragRight) {
                return;
            }
            
            if(dragLeft) {
                this._updateLeft(e.offsetX);
            } else {
                this._updateRight(e.offsetX);
            }   
        });

        container.append(this._leftHandle, this._rightHandle);

        this.rootElement().append(container);
    }

    /**
     * 
     * @param {number} position 
     */
    _updateLeft(position) {
        this._leftHandle.text(position.toString());
        this._leftHandle.css("left", position);
    }

    _updateRight(position) {
        this._rightHandle.text(position.toString());
        this._rightHandle.css("left", position);
    }

    update() {
        this._updateLeft(this._lower);        
        this._updateRight(this._upper);
    }
}