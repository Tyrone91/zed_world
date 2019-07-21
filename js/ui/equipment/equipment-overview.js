import { Equipable } from "../../equipment/equipable.js";
import { ViewComponent } from "../view-component.js";
import { EquipmentHolder } from "../../equipment/equipment-holder.js";
import { EquipablePanel } from "./equipable-panel.js";


export class EquipmentOverview extends ViewComponent {

    /**
     * 
     * @param {EquipmentHolder} holder 
     */
    constructor(holder) {
        super();
        this._holder = holder;
        this._callback = (slot, item, holder) => {};
        this.clazz("equipment-overview");
    }

    /**
     * 
     * @param {Equipable} equipable 
     * @param {EquipmentHolder.HolderSlot} slot
     */
    _panel(equipable, slot) {
        this.rootElement().append( new EquipablePanel(equipable, slot).domElement());
    }

    /**
     * 
     * @param  {[EquipmentHolder.HolderSlot, Equipable][][]} rows
     */
    _rows(rows) {
        rows.forEach( array => {
            const rowEle = $("<div>").addClass("equipment-row");
            array.forEach( entry =>{
                const [slot, item] = entry;

                const ele = new EquipablePanel(item, slot);
                ele.onclick(this._callback);
                rowEle.append( ele.domElement() );
            });
            this.rootElement().append(rowEle);
        }); 
    }

    /**
     * 
     * @param {EquipmentHolder.HolderSlot} slot 
     * @returns {[EquipmentHolder.HolderSlot, Equipable]}
     */
    _get(slot) {
        return [slot, this._holder.get(slot)];
    }

    /**
     * 
     * @param {(item:Equipable, slot:EquipmentHolder.HolderSlot, holder:EquipmentHolder) => void} callback 
     */
    onclick(callback) {
        this._callback = callback;
    }

    update() {
        const root = this.rootElement();

        this._rows([
            [this._get(EquipmentHolder.Slot.HEAD)],
            [this._get(EquipmentHolder.Slot.ARMS), this._get(EquipmentHolder.Slot.BODY), this._get(EquipmentHolder.Slot.MAIN_WEAPON)],
            [this._get(EquipmentHolder.Slot.BELT)],
            [this._get(EquipmentHolder.Slot.LEGS)]
        ]);
        
    }
}