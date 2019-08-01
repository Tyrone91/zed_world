import { LootWrapper } from "./loot-wrapper.js";
import { EquipmentTemplate } from "../equipment/generator/equipment-template.js";

export class LootCrateEquipment extends LootWrapper {

    /**
     *         
     * @param {number} weight 
     * @param  {...EquipmentTemplate} templates 
     */
    constructor(weight = 1, ...templates) {
        super(LootCrateEquipment.Type, weight, LootCrateEquipment.DESC_KEY, ...templates);
    }
}

LootCrateEquipment.Type = "LootCrateEquipment";
LootCrateEquipment.DESC_KEY = "LOOT_CRATE_DESCRIPTION_KEY";