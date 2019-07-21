import { ViewComponent } from "../view-component.js";
import { GameEnvironment } from "../../core/game-environment.js";
import { Survivor, SurvivorFist } from "../../core/survivor.js";
import { StatsViewer } from "../stats-viewer.js";
import { EquipablePanel } from "../equipment/equipable-panel.js";
import { EquipmentOverview } from "../equipment/equipment-overview.js";
import { ArmoryView } from "../equipment/armory-view.js";
import { EquipmentHolder } from "../../equipment/equipment-holder.js";
import { Equipable } from "../../equipment/equipable.js";

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
        this._combatStats = new StatsViewer(survivor.combatstats);

        this._equipmentPanel = new EquipmentOverview(survivor.equipment);
        this._equipmentPanel.onclick( (item, slot, holder) => {
            const armoryView = new ArmoryView(this._game.getCamp().getArmory());
            armoryView.filterByType(this._typeForSlot(slot));
            armoryView.onclick( selected => {
                
                const former = this._survivor.equipment.unequipFrom(slot);
                if(former && !(former instanceof SurvivorFist)) {
                    this._game.getCamp().getArmory().addEquipment(former);
                }
                this._survivor.equipment.equip(selected);
                this._game.getCamp().getArmory().removeEquipment(selected);
                this.manager.popContent();
            });

            this.manager.pushContent( () => armoryView.domElement() );
        });
        this.clazz("survivor-detail-overview");
    }

    /**
     * 
     * @param {EquipmentHolder.HolderSlot} equipmentSlot 
     */
    _typeForSlot(equipmentSlot) {
        switch(equipmentSlot) {
            case EquipmentHolder.Slot.MAIN_WEAPON: return Equipable.Type.WEAPON;
            case EquipmentHolder.Slot.ARMS: return Equipable.Type.ARMS;
            case EquipmentHolder.Slot.BELT: return Equipable.Type.BELT;
            case EquipmentHolder.Slot.BODY: return Equipable.Type.BODY;
            case EquipmentHolder.Slot.HEAD: return Equipable.Type.HEAD;
            case EquipmentHolder.Slot.LEGS: return Equipable.Type.LEGS;
        }
    }



    update() {
        const root = this.rootElement();
        root.empty();

        this._stats.update();

        const header = $("<div>").addClass("survivor-detail-overview-header");

        const title = $("<span>").text(this.resolve("NAME") + ": ");
        const nameTag = $("<span>").text(/**@type {string} */(this._survivor.name()));

        header.append(title, nameTag);

        const body = $("<div>").addClass("survivor-detail-overview-body");

        const statsContainer = $("<div>").addClass("survivor-detail-overview-stats-container");
        statsContainer.append(this._stats.domElement(), this._combatStats.domElement() );
        body.append(statsContainer, this._equipmentPanel.domElement());
        
        root.append(header, body);
    }
}