import { ViewComponent } from "../view-component.js";
import { Equipable } from "../../equipment/equipable.js";
import { CanvasImage } from "../canvas-image.js";

const EQUIPABLE_TO_PATH = new Map([
    [Equipable.Type.WEAPON, "weapons"],
    [Equipable.Type.BODY, "body"]
]);

export class EquipableImage extends ViewComponent {

    /**
     * 
     * @param {Equipable} equipable 
     */
    constructor(equipable) {
        super();
        this._equipable = equipable;
        this._img = new CanvasImage(equipable.icon, this._resolveEquipment() );

        const root = this.rootElement();
        root.append(this._img.domElement());
        
        this._img.width = 75;
        this._img.height = 75;

        this.clazz("equipable-image");
    }

    _resolveEquipment() {
        return EQUIPABLE_TO_PATH.get(this._equipable.type) || "";
    }

    /**
     * 
     * @param {(e:Equipable)=>void} callback 
     */
    onclick(callback) {
        this.rootElement().off("click");
        this.rootElement().on("click", e => {
            callback(this._equipable);
        });
    }

    update() {
        this._img.update();
        this.rootElement()[0].dataset.name = this._equipable.name;
        this.rootElement()[0].dataset.icon = this._equipable.icon;
    }
}