import { Resource, ResourceWood, ResourceMetal, ResourceFood } from "./resources.js";
import { BaseLoot } from "./base-loot.js";
import { LootWrapperResource } from "./loot-wrapper-resource.js";
import { Equipable } from "../equipment/equipable.js";
import { LootWrapperEquipment } from "./loot-wrapper-equipment.js";

export class LootCollector {

    constructor() {

        /**@type {LootWrapperResource[]} */
        this._resources = [];

        /**@type {LootWrapperEquipment[]} */
        this._equipment = [];

        /**@type {Equipable[]} */
        this._lootcrates = [];
    }

    /**
     * 
     * @param {LootWrapperResource} resource 
     */
    receiveResource(resource) {
        console.log("receiveResource called with", resource);
        this._resources.push(resource);
    }

    /**
     * 
     * @param {LootWrapperEquipment} equipment 
     */
    receiveEquipment(equipment) {
        this._equipment.push(equipment);
    }

    receiveCrate(crate) {
        this._lootcrates.push(crate);
    }

    /**
     * 
     * @param {...BaseLoot} loot
     */
    receive(...loot) {
        loot.forEach( l => l.receive(this));
        return this;
    }

    /**
     * Returns the resources only without description or name,
     */
    get resources() {
        const res = this.rawresources;
        return {
            food: /**@type {ResourceFood[]} */ (res.food.map(wrapper => wrapper.content)),
            wood: /**@type {ResourceWood[]} */(res.wood.map(wrapper => wrapper.content)),
            metal: /**@type {ResourceMetal[]} */ (res.metal.map(wrapper => wrapper.content))
        }
    }

    /**
     * Returns the wrapper for the resources.
     */
    get rawresources() {
        console.log("called resources");
        return {
            food: /**@type {LootWrapperResource[]} */ (this._resources.filter(res => res.content.type == Resource.Type.FOOD)),
            wood: /**@type {LootWrapperResource[]} */(this._resources.filter(res => res.content.type == Resource.Type.WOOD)),
            metal: /**@type {LootWrapperResource[]} */ (this._resources.filter(res => res.content.type == Resource.Type.METAL))
        }
    }

    get rawequipment() {
        return this._equipment;
    }

    get equipment() {
        return this.rawequipment.map(wrapper => wrapper.content);
    }

    get crates() {
        return this._lootcrates;
    }
}