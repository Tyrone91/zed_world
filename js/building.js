function Building(id, name, onUpdate){
    this._id = Util.require(id, "Building: ID was null. Each building needs an unique id");
    this._name = Util.require(name);
    this._costs = [];
    this._description = "";
    this._onUpdate = function(camp){};
    this._level = 0;
    this._buildable = true;
    this._viewable = true;
    this._onSetup = function(camp){};
    this._onUpgrade = function(camp){};
}

Building.prototype = {
    costs: function(costs){
        return Util.setOrGet(this, '_costs', costs);
    },
    name: function(value){
        return Util.setOrGet(this,'_name',value);
    },
    description: function(value){
        return Util.setOrGet(this,'_description', value);
    },
    onUpdate: function(func){
        return Util.setOrGet(this, '_onUpdate', func);
    },
    update: function(camp){
        Util.safeInvoke(this._onUpdate)(camp);
        return this;
    },
    level: function(value){
        return Util.setOrGet(this, '_level', value);
    },
    buildable: function(value){
        return Util.setOrGet(this, '_buildable', value);
    },
    viewable: function(value){
        return Util.setOrGet(this, '_viewable', value);
    },
    id: function(){
        return this._id;
    },
    onSetup: function(value){
        return Util.setOrGet(this, '_onSetup', value);
    },
    constrcuted: function(camp){
        Util.safeInvoke(this._onSetup)(camp);
        return this;
    },
    upgrade: function(camp){
        const level = this.level();
        this.level(level + 1);  //Maybe I want to add a listener to that, so just call one function everytime for easy implementaion.
        Util.safeInvoke(this._onUpgrade)(camp);
        return this;
    },
    onUpgrade: function(value){
        return Util.setOrGet(this, '_onUpgrade',value);
    }
}

var Buildings = {
    Mill: function(foodPerUpdate){
        Building.call(this, 'BUILDING_MILL', 'Mill');
        this._production = foodPerUpdate || 1;
        let self = this;
        this.onUpdate( camp => {
            let foodValue =  self._production;
            let res = new Loot.Food('Food from mill', foodValue);
            camp.addResource(res);
            console.log("update");
        });
        let currentFoodCap = 25;
        this.onSetup( camp => {
            camp.resourceCap(Loot.Food.TYPE , currentFoodCap);
        });
        this.onUpgrade( camp => {
            currentFoodCap *= 2;
            self._production = self._production * 1.5;
            camp.resourceCap(Loot.Food.TYPE, currentFoodCap );
        });
    },
    Storage: function(){
        Building.call(this, 'BUILDING_STORAGE', 'Storage');
        const self = this;
        this.onUpdate( camp => {

        });
    },
    Quarters: function(){
        Building.call(this,'BUILDING_QUARTERS', 'Quarters');
    },
    Quarry: function(){
        Building.call(this, 'BUILDING_Quarry', 'Quarry');
    },
    Smith: function(){
        Building.call(this, 'BUILDING_SMITH', 'Smith');
    },
    CommandCenter: function(){
        Building.call(this, 'BUILDING_COMMAND_CENTER', 'Command Center');
    },
    ShootingRange: function(){
        Building.call(this, 'BUILDING_SHOOTING_RANGE', 'Shooting Range');
    }
}

Buildings.Mill.prototype = Object.create(Building.prototype);
Buildings.Storage.prototype = Object.create(Building.prototype);
Buildings.Quarters.prototype = Object.create(Building.prototype);
Buildings.Quarry.prototype = Object.create(Building.prototype);
Buildings.Smith.prototype = Object.create(Building.prototype);
Buildings.CommandCenter.prototype = Object.create(Building.prototype);
Buildings.ShootingRange.prototype = Object.create(Building.prototype);
