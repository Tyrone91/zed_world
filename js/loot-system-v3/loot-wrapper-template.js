import { BaseLoot } from "./base-loot.js";
import { EquipmentTemplate } from "../equipment/generator/equipment-template.js";
import { WeaponGenerator } from "../equipment/generator/weapon-generator.js";
import { LootCollector } from "./loot-collector.js";
import { LootWrapperEquipment } from "./loot-wrapper-equipment.js";

export class LootWrapperTemplate extends BaseLoot {

    /**
     * 
     * @param {string} name 
     * @param {string} desc 
     * @param {EquipmentTemplate} template 
     * @param {WeaponGenerator} weapongenerator 
     */
    constructor(name, desc, template, weapongenerator) {
        super(LootWrapperTemplate.TYPE, name, desc);
        this._template = template;
        this._weapongenerator = weapongenerator;
    }

    /**
     * 
     * @param {LootCollector} collector 
     */
    receive(collector) {

        const equipable = this._weapongenerator.generate(this._template);
        collector.receiveEquipment( new LootWrapperEquipment(this.name, this.description, equipable));

    }   
}


LootWrapperTemplate.TYPE = "LootWrapperTemplate";