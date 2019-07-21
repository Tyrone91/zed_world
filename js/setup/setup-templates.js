import { EquipmentTemplate } from "../equipment/generator/equipment-template.js";
import { LootTable } from "../loot-system-v2/loot-table.js";

//TODO: move this into a JSON file that can be loaded.

export function templateM4() {
    const template = new EquipmentTemplate("M4", LootTable.Rarity.COMMON, "Good alroudner Assault Rifle");
    template.accuracy.set(25,50);
    template.actionsPerRound.set(1,5);
    template.damage.set(5,12);
    template.stability.set(35,75);
    template.lowerOptimialRange.set(10,15);
    template.upperOptimalRange.set(20, 45);
    template.icon = "M4.jpg";
    return template;
}

export function templateAK() {
    const template = new EquipmentTemplate("AK", LootTable.Rarity.COMMON, "A damge dealer assault rifle with some accuracy problems");
    template.accuracy.set(16,45);
    template.actionsPerRound.set(2,4);
    template.damage.set(12,16);
    template.stability.set(20,50);
    template.lowerOptimialRange.set(5,12);
    template.upperOptimalRange.set(15, 40);
    template.icon = "AK47.jpg";
    return template;
}

export function templateMP5() {
    const template = new EquipmentTemplate("MP5", LootTable.Rarity.COMMON, "SMG");
    template.accuracy.set(20,50);
    template.actionsPerRound.set(3,7);
    template.damage.set(5,10);
    template.stability.set(50,75);
    template.lowerOptimialRange.set(0,5);
    template.upperOptimalRange.set(12, 25);
    template.icon = "MP5.jpg";
    return template;
}

export function templates() {
    return [
        templateAK(),
        templateM4(),
        templateMP5()
    ];
}