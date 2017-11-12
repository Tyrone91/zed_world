/**
 * @constructor
 * @param {string} name 
 */
function Camp(name){
    this._name = Util.require(name);
    this._resources = {};
    this._foodConsumptionModifier = 1.0;

    let wood = new Loot.Wood('Wood',0.0);
    let stone = new Loot.Stone('Stone',0.0);
    let food = new Loot.Food('Food',0.0);

    this._resources[wood.type()] = wood;
    this._resources[stone.type()] = stone;
    this._resources[food.type()] = food;

    this._resourceCaps = {};
    this._buildings = {};
    this._campInventory = [];
}
Camp.prototype = {
    _accessResource: function(resource){
        let res = this._resources[resource.type()];
        if(!Util.exists(res) ){
            throw "The resoruce '"+resource.type()+"' can't be added to the camp";
        }
        return res;
    },
    _calculateBuildings: function(){
        const self = this;
        for(let key in self._buildings){
            const building = self._buildings[key];
            building.update(this);
        }
    },
    _calculateNeeds: function(){

    },
    foodConsumptions: function(value){
        return Util.setOrGet(this, '_foodConsumptionModifier', value);
    },
    addResource: function(resource){
        const res = this._accessResource(resource).combine(resource);
        const cap = this.resourceCap(resource.type());
        if(Util.exists(cap) && cap < res.value() && cap > 0){
            res.value(cap);
        }
        return this;
    },
    removeResource: function(rescource){
        this._accessResource(rescource).substract(rescource);
        return this;
    },
    resourcesAsArray: function(){
        var res = [];
        for( let key in this._resources){
            let v = this._resources[key];
            res.push(v);
        }
        return res;
    },
    resources: function(){
        return this._resources;
    },
    update: function(){
        this._calculateBuildings();
        this._calculateNeeds();
    },
    resourceCap: function(resourceType, value){
        if(Util.exists(value)){
            this._resourceCaps[resourceType] = value;
            return this;
        }else{
            return this._resourceCaps[resourceType];
        }
    },
    bindBuilding: function(building){
        this._buildings[building.id()] = building;
        building.constrcuted(this);
    },
    addToInventory: function(itemBundle){
        const self = this;
        const unpack = function(bundle){
            bundle.forEach( i => {
                if(Array.isArray(i) ){
                    unpack(i);
                }else{
                    self._campInventory.push(i);
                }
            });
        };
        if(Array.isArray(itemBundle)){
            unpack(itemBundle);
        }else{
            self._campInventory.push(itemBundle);
        }
        return this;
    },
    inventory: function(){
        return this._campInventory;
    }
}
