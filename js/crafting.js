class CraftingRecipe{

    /**
     * 
     * @typedef Options
     * @property {number} cost
     * @property {number} craftingTime
     * @property {string} name 
     * @property {string} description
     * @property {string} iconName
     * 
     * @param {function} creationCallback Should return the crafted object
     * @param {Options} options
     */
    constructor(creationCallback, options = {} ){
        this._creationCallback = creationCallback;
        this._craftingCost      = options.cost || 0;
        this._name              = options.name || "PLACEHOLDER CRAFTING-RECIPE";
        this._description       = options.description || "";
        this._icon              = options.iconName || "DEFAULT_CRAFTING_ICON";
        this._craftingTime      = options.craftingTime || 0;
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

    get craftingTime(){
        return this._craftingTime;
    }

    /**
     * @returns {any}
     */
    craft(){
        return this._creationCallback();
    }
}

class CraftingQueueElement{
    /**
     * @param {CraftingRecipe} recipe 
     */
    constructor(recipe, onCrafted){
        this._time = 0;
        this._recipe = recipe;
        this._callback = onCrafted;
    }

    get finished(){
        return this._time >= this._recipe.craftingTime;
    }

    get time(){
        return this._time;
    }

    get recipe(){
        return this._recipe;
    }

    get onCrafted(){
        return this._callback;
    }

    update(){
        ++this._time;
        return this;
    }
}

class CraftingHandler { //TODO: maybe make mor materials, till then only one resource so basically just a number

    /**
     * 
     * @param {number} initial 
     * @param {number} desconstructReturnFactor
     */
    constructor(craftingQueueLength = 1, initial = 0, desconstructReturnFactor = 0.5){
        this._materials = initial;
        this._knownRecipes = [];
        this._deconstructFactor = desconstructReturnFactor;
        this._craftingQueueLength = craftingQueueLength;

        /**@type {CraftingQueueElement} */
        this._craftingQueue = [];
        /**@type {EventDispatcher}*/
        const dispatcher = window.GameContext.EventDispatcher;
        dispatcher.subscribe(GameEvents.ROUND_END, () => this._update() );
    }

    /**
     * 
     * @param {CraftingQueueElement} queueElement 
     */
    _craftItem(queueElement){
        const res = queueElement.recipe.craft();
        queueElement.onCrafted(res);
        Context.EventDispatcher.dispatchEvent(GameEvents.WEAPON_CRAFTED, new WeaponCraftEvent(res) );
    }

    _update(){
        for(let i = this._craftingQueue.length - 1; i >= 0; --i){ // By going backwards over the array I can remove items without skipping any.
            const element = this._craftingQueue[i];
            console.log("recipe in queue: " + element.recipe.name + " time: " + element.time + " finished: " + element.finished);
            console.log(element);
            element.update();
            if(element.finished){
                this._craftingQueue.splice(i,1);
                this._craftItem(element);
            }
        }
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
    create(craftingRecipe, onCreationCallback = (craftedObject) => {} ){
        this._materials -= craftingRecipe.cost;
        const queueElement = new CraftingQueueElement(craftingRecipe, onCreationCallback);
        if(queueElement.finished){
            this._craftItem(queueElement);
            return;
        }
        this._craftingQueue.push(queueElement);
        return this;     
    }

    /**
     * 
     * @param {CraftingRecipe} craftingRecipe 
     */
    canCreate(craftingRecipe){
        return (this._materials - craftingRecipe.cost) >= 0 && this.getMaxCraftingCount() > this.getItemInCreationCount();
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

    /**
     * @returns {[CraftingQueueElement]}
     */
    getCraftigQueue(){
        return this._craftingQueue;
    }

    getMaxCraftingCount(){
        return this._craftingQueueLength;
    }

    getItemInCreationCount(){
        return this._craftingQueue.length;
    }
}