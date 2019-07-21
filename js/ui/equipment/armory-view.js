import { ViewComponent } from "../view-component.js";
import { Armory } from "../../core/armory.js";
import { Equipable } from "../../equipment/equipable.js";
import { EquipablePanel } from "./equipable-panel.js";
import { EquipableImage } from "./equipable-image.js";


export class ArmoryView extends ViewComponent {

    /**
     * 
     * @param {Armory} armory 
     */
    constructor(armory) {
        super();
        this._armory = armory;
        this._filters = [];
        /**@type {Equipable.EquipmentType} */
        this._typeFilter = null;
        this._callback = (e) => {};
        this.clazz("armory-view");
    }

    clearFilter() {
        throw "Not yet implemented"; //TODO: 
    }

    addFilter() {
        throw "Not yet implemented"; //TODO: 
    }

    /**
     * 
     * @param {Equipable.EquipmentType} type 
     */
    filterByType(type) {
        this._typeFilter = type;
    }

    clearTypeFilter() {
        this._typeFilter = null;
    }

    _getEquipment() {
        if(this._typeFilter) {
            return this._armory.getEquipmentByType(this._typeFilter);
        }
        return this._armory.getAllEquipment();
    }

    /**
     * 
     * @param {(e:Equipable) => void} callback 
     */
    onclick(callback) {
        this._callback = callback;
    }

    update() {
        const root = this.rootElement();
        root.empty();

        const equipment = this._getEquipment();
        equipment.forEach( e => {
            const panel = new EquipableImage(e);
            panel.onclick( eq => {
                this._callback(eq);
            });
            root.append(panel.domElement());
        });

    }
}