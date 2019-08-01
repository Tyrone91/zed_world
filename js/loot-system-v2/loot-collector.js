import { LootContainer } from "./loot-container.js";
import { LootWrapper } from "./loot-wrapper.js";
import { LootCreateResource } from "./loot-crate-resource.js";
import { ResourceWood, ResourceMetal, ResourceFood, Resource } from "../loot-system/resources.js";
import { WeaponGenerator } from "../equipment/generator/weapon-generator.js";
import { LootCrateEquipment } from "./loot-crate-equipment.js";

/**
 * 
 * @param {LootWrapper[]} lootWrapppers 
 */
export function collectresources(lootWrapppers){

    /**@type {Resource[]} */
    const resources =  lootWrapppers.filter( w => w.type === LootCreateResource.Type).map( w => w.content[0]);

    const wood = new ResourceWood(0);
    const metal = new ResourceMetal(0);
    const food = new ResourceFood(0);

    resources.filter( res => res.type === Resource.Type.WOOD).forEach( res => wood.add(res));
    resources.filter( res => res.type === Resource.Type.METAL).forEach( res => metal.add(res));
    resources.filter( res => res.type === Resource.Type.FOOD).forEach( res => food.add(res));

    return {wood: wood, metal: metal, food: food};
}

/**
 * 
 * @param {WeaponGenerator} generator 
 * @param {LootWrapper[]} wrappers 
 */
export function collectequipment(generator, wrappers) {
    const templates = wrappers.filter( c => c.type === LootCrateEquipment.Type);
}

/**
 * 
 * @param {LootWrapper[]} wrappers 
 */
export function collectcrates(wrappers) {

}