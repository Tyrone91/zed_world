import { ViewComponent } from "../view-component.js";
import { Equipable } from "../../equipment/equipable.js";
import { EquipableImage } from "./equipable-image.js";
import { EquipmentHolder } from "../../equipment/equipment-holder.js";

export class EquipablePanel extends ViewComponent {

    /**
     * 
     * @param {Equipable} item 
     * @param {EquipmentHolder.HolderSlot} slot;
     */
    constructor(item, slot) {
        super();
        this._item = item;
        this._slot = slot;
        this._img = new EquipableImage(item);

        const slotPanel = $("<span>").text(this.resolve(slot.id));
        this.rootElement().append(slotPanel);
        this.rootElement().append(this._img.domElement());

        this.clazz("equipment-panel");
        this.data("slot", slot.id);
    }

    /**
     * 
     * @param {(item:Equipable, slot:EquipmentHolder.HolderSlot) => void} callback 
     */
    onclick(callback) {
        this.rootElement().off("click");
        this.rootElement().on("click", e => {
            callback(this._item, this._slot);
        });
    }

    update() {
        this._img.update();
    }
}