import { BaseLoot } from "./base-loot.js";
import { LootCollector } from "./loot-collector.js";
import { Equipable } from "../equipment/equipable.js";

export class LootWrapperEquipment extends BaseLoot {

    /**
     * 
     * @param {string} name 
     * @param {string} description 
     * @param {Equipable} equipment
     */
    constructor(name, description, equipment) {
        super(LootWrapperEquipment.Type, name, description);
        this._content = equipment;
    }

    /**
     * 
     * @param {LootCollector} collector 
     */
    receive(collector) {
        collector.receiveEquipment(this);
    }

    get content() {
        return this._content;
    }
}

LootWrapperEquipment.Type = "LootWrapperEquipment";