function Location(id, name, options){
    options = options || {};
    this._id = Util.require(id);
    this._name = Util.require(name);
    this._baseEncounterChance = options.baseEncounterChance || 0.05;
    this._baseLootChance = options.baseLootChance || 0.40;
    this._baseVisibilityReduction = options.baseVisibilityReduction || -10;
    this._baseMaxRange = options.baseMaxRange || 100;
    this._baseReinforcementChance = options.baseReinforcementChance || 0.05;

    this._locationAttributes = new LocationAttributes();
    this._locationAttributes.encounterChance(options.baseEncounterChance);
    this._locationAttributes.commonItemDropChance(options.baseCommonLootChance);
    this._locationAttributes.visibilityReduction(options.baseVisibilityReduction);
    this._locationAttributes.startingRange(options.baseMaxRange);
    this._locationAttributes.reinforcementChance(options.baseReinforcementChance);
}

Location.prototype = {
    id: function(){
        return this_id;
    },
    name: function(value){
        return Util.setOrGet(this,'_name', value);
    },
    danger: function(){

    },
    attributes: function(){
        return this._locationAttributes;
    }
}

function MissionMap(){
    this._locationPairs = [];
}

MissionMap.prototype = {
    addLocation: function(position,location){
        const x = position.x;
        const y = position.y;
        const point = Util.pointOf(x,y);
        this._locationPairs.push(Util.pairOf(point, location));
        return this;
    },

    locationPairs: function(){
        return this._locationPairs;
    }
}
