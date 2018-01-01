class CraftingRecipe{

    /**
     * 
     * @param {number} cost 
     */
    constructor(constructorCallback, name = "PLACEHOLDER CRAFTING-RECIPE", cost = 0 , description = "", icon = "DEFAULT_CRAFTING_ICON"){
        this._craftingCost = cost;
        this._constructorCallback = constructorCallback;
        this._name = name;
        this._description = description;
        this._icon = icon;
    }

    /**
     * @returns {number}
     */
    get cost(){
        return this._craftingCost;
    }

    get name(){
        return this._name;
    }

    get description(){
        return this._description;
    }

    get icon(){
        return this._icon;
    }

    /**
     * @returns {any}
     */
    craft(){
        return this._constructorCallback();
    }
}

class CraftingHandler { //TODO: maybe make mor materials, till then only one resource so basically just a number

    /**
     * 
     * @param {number} initial 
     * @param {number} desconstructReturnFactor
     */
    constructor(initial = 0, desconstructReturnFactor = 0.5){
        this._materials = initial;
        this._knownRecipes = [];
        this._deconstructFactor = desconstructReturnFactor;
    }

    materialCount(){
        return this._materials;
    }

    /**
     * 
     * @param {CraftingRecipe} craftingRecipe 
     */
    deconstruct(craftingRecipe){
        this._materials += Math.floor(craftingRecipe.cost * desconstructReturnFactor);
    }

    /**
     * 
     * @param {CraftingRecipe} craftingRecipe 
     */
    create(craftingRecipe){
        this._materials -= craftingRecipe.cost;
        const result = craftingRecipe.craft();
        Context.EventDispatcher.dispatchEvent(GameEvents.WEAPON_CRAFTED, new WeaponCraftEvent(result) );
        return result;     
    }

    /**
     * 
     * @param {CraftingRecipe} craftingRecipe 
     */
    canCreate(craftingRecipe){
        return (this._materials - craftingRecipe.cost) >= 0;
    }

    /**
     * 
     * @param {...CraftingRecipe} craftingRecipe 
     */
    addRecipe(...craftingRecipe){
        this._knownRecipes.push(...craftingRecipe);
        return this;
    }

    /**
     * @returns {[CraftingRecipe]}
     */
    getAllRecipes(){
        return this._knownRecipes;
    }
    
    changeMaterialCountBy(value){
        this._materials += value;
    }
}