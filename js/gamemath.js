function LocationAttributes(options){
    options = options || {};
    this._data = [];
    this._data[LocationAttributes.VISIBILITY_REDUCTION] = options.visibility || 1;
    this._data[LocationAttributes.MAX_ZOMBIE_COUNT] = options.maxZombieCount || 1;
    this._data[LocationAttributes.MIN_ZOMBIE_COUNT] = options.minZombieCount|| 1;
    this._data[LocationAttributes.COMMON_ITEM_DROP_CHANCE] = options.commonItemDropChance || 1;
    this._data[LocationAttributes.RARE_ITEM_DROP_CHANCE] = options.rareItemDropChance || 1;
    this._data[LocationAttributes.EXTRAORDINARY_ITEM_DROP_CHANCE] = options.extraordinaryItemDropChance || 1;
    this._data[LocationAttributes.STARTING_RANGE] = options.startingRange || 1;
    this._data[LocationAttributes.REINFORCEMENT_CHANCE] = options.reinforcementChance || 1;
    this._data[LocationAttributes.ENCOUNTER_CHANCE] = options.encounterChance || 1;
}
LocationAttributes.VISIBILITY_REDUCTION = 0;
LocationAttributes.MAX_ZOMBIE_COUNT = 1;
LocationAttributes.MIN_ZOMBIE_COUNT = 2;
LocationAttributes.COMMON_ITEM_DROP_CHANCE = 3;
LocationAttributes.RARE_ITEM_DROP_CHANCE = 4;
LocationAttributes.EXTRAORDINARY_ITEM_DROP_CHANCE = 5;
LocationAttributes.STARTING_RANGE = 6;
LocationAttributes.REINFORCEMENT_CHANCE = 7;
LocationAttributes.ENCOUNTER_CHANCE = 8;
LocationAttributes.prototype = {
    apply: function(attributes){
        for(let i = 0; i < this._data.length; ++i){
            this._data[i] = this._data[i] * attributes._data[i];
        }
        return this;
    },
    _accessHelper(index, value){
        if(typeof value === 'undefined'){
            return this._data[index];
        }else{
            this._data[index] = value;
            return this;
        }
    },
    visibilityReduction: function(value){
        return this._accessHelper(LocationAttributes.VISIBILITY_REDUCTION, value);
    },
    maxZombieCount: function(value){
        return this._accessHelper(LocationAttributes.MAX_ZOMBIE_COUNT, value);
    },
    minZombieCount: function(value){
        return this._accessHelper(LocationAttributes.MIN_ZOMBIE_COUNT, value);
    },
    commonItemDropChance: function(value){
        return this._accessHelper(LocationAttributes.COMMON_ITEM_DROP_CHANCE, value);
    },
    rareItemDropChance: function(value){
        return this._accessHelper(LocationAttributes.RARE_ITEM_DROP_CHANCE, value);
    },
    extraordinaryItemDropChance: function(value){
        return this._accessHelper(LocationAttributes.EXTRAORDINARY_ITEM_DROP_CHANCE, value);
    },
    startingRange: function(value){
        return this._accessHelper(LocationAttributes.STARTING_RANGE, value);
    },
    reinforcementChance: function(value){
        return this._accessHelper(LocationAttributes.REINFORCEMENT_CHANCE, value);
    },
    encounterChance: function(value){
        return this._accessHelper(LocationAttributes.ENCOUNTER_CHANCE, value);
    },
    inverse: function(){
        for(let i = 0; i < this._data.length; ++i){
            this._data[i] = 1 / this._data[i];
        }
    },
    scalar: function(s){
        for(let i = 0; i < this._data.length; ++i){
            this._data[i] = this._data[i] * s;
        }
    },

    neutralize: function(){
        for(let i = 0; i < this._data.length; ++i){
            this._data[i] = 1;
        }
    },

    duplicate: function(){
        const res = new LocationAttributes();
        for(let i = 0; i < this._data.length; ++i){
            res._data[i] = this._data[i];
        }
        return res;
    }

}
