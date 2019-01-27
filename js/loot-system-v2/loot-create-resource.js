import { LootWrapper } from "./loot-wrapper.js";
import { Resource, ResourceWood, ResourceMetal, ResourceFood } from "../loot-system/resources.js";

export class LootCreateResource extends LootWrapper {

    /**
     * 
     * @param {number} weight 
     * @param {Resource} resource
     */
    constructor(weight, resource){
        super(LootCreateResource.Type, weight, "RESOURCES_" + resource.type, resource);
    }
}

export class CreateWood extends LootCreateResource {
    constructor(weight, amount){
        super(weight, new ResourceWood(amount));
    }
}

export class CreateFood extends LootCreateResource {
    constructor(weight, amount){
        super(weight, new ResourceFood(amount));
    }
}

export class CreateMetal extends LootCreateResource {
    constructor(weight, amount){
        super(weight, new ResourceMetal(amount));
    }
}

LootCreateResource.Type = "RESOURCE_LOOT";