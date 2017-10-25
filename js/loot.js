var Loot = {
    Resource: function(type, name){
            this._resourceType = Util.require(type);
            this._name = Util.require(name);
            this._value = 0.0;
            this._changeCallbacks = [];
    },
    Equipment: function(id, name, level, type){
        this._id = Util.require(id, "Equipment: Equipment needs an ID");
        this._name = name || "NO_NAME";
        this._stats = new Stats();
        this._type = type || Loot.Equipment.Type.UNDEFINED;
        this._level = level || 0;
    }
}

Loot.Resource.prototype = {
    type: function(){
        return this._resourceType;
    },

    name: function(value){
        return Util.setOrGet(this, '_name', value);
    },
    /**
     * Current amount of the resource.
     * @param  {number} v Optional. If given the new amount of the resource will be set to the value
     * @return {number|object}  If used as a setter this will be returned, otherwise the current value
     */
    value: function(v){
        if(Util.exists(v)){
            const oldValue = this._value;
            const newValue = v;
            this._value = v;
            this._changeCallbacks.forEach( callback => callback(this, oldValue, newValue));
            return this;
        }else{
            return this._value;
        }
    },
    /**
     * Adds the amount of same type resource together and the
     * original object with the modefied values.
     * @param  {Resource} resource Same type resource that will be added.
     * @return {resources}          this.
     */
    combine: function(resource){
        if(this.type() !== resource.type()){
            throw "Can't combine different resources";
        }
        const newValue = this._value + resource.value();
        this.value(newValue);
        return this;
    },
    substract: function(resource){
        if(this.type() !== resource.type()){
            throw "Can't substract different resources";
        }
        let newValue = this._value - resource.value();
        if(newValue < 0){
            newValue = 0.0;
        }
        this.value(newValue);
        return this;
    },
    addOnChangeListener: function(callback){
        this._changeCallbacks.push(callback);
        return this;
    },
    clearAllListener: function(){
        this._changeCallbacks = [];
        return this;
    }
}

Loot.Wood = function(name, amount){
    Loot.Resource.call(this, Loot.Wood.TYPE, name);
    this.value(amount);
}
Loot.Wood.prototype = Object.create(Loot.Resource.prototype);
Loot.Wood.TYPE = "RESOURCE_WOOD";

Loot.Stone = function(name, amount){
    Loot.Resource.call(this, Loot.Stone.TYPE, name);
    this.value(amount);
}
Loot.Stone.prototype = Object.create(Loot.Resource.prototype);
Loot.Stone.TYPE = "RESOURCE_STONE";

Loot.Food = function(name, amount){
    Loot.Resource.call(this, Loot.Food.TYPE, name);
    this.value(amount);
}
Loot.Food.prototype = Object.create(Loot.Resource.prototype);
Loot.Food.TYPE =  "RESOURCE_FOOD";

Loot.Equipment.prototype = {
    _slotHelper: function(owner, slot, value){
        if(slot === Loot.Equipment.Type.BODY_ARMOR){
            owner.bodyEquipment(value);
        } else if(slot === Loot.Equipment.Type.GLOVES){
            owner.glovesEquipment(value);
        } else if (slot === Loot.Equipment.Type.HEAD_ARMOR){
            owner.headEquipment(value);
        } else if (slot === Loot.Equipment.Type.LEG_ARMOR){
            owner.legEquipment(value);
        } else if (slot === Loot.Equipment.Type.WEAPON){
            owner.mainWeapon(value);
        } else {
            throw "Equipment: Slot not found";
        }
    },
    stats: function(value){
        return Util.setOrGet(this, '_stats', value);
    },
    id: function(){
        return this._id;
    },
    name: function(value){
        return Util.setOrGet(this, '_name', value);
    },
    equipTo: function(owner){
        owner.stats().combine(this._stats);
        this._slotHelper(owner,this._type,this);
        return this;
    },
    unequipFrom: function(owner){
        owner.stats().reduce(this._stats);
        this._slotHelper(owner,this._type, null);
        return this;
    },
    makeHeadArmor: function(){
        this._type = Loot.Equipment.Type.HEAD_ARMOR;
        return this;
    },
    makeBodyArmor: function(){
        this._type = Loot.Equipment.Type.BODY_ARMOR;
        return this;
    },
    makeGloves: function(){
        this._type = Loot.Equipment.Type.GLOVES;
        return this;
    },
    makeLegArmor: function(){
        this._type = Loot.Equipment.Type.LEG_ARMOR;
        return this;
    },
    makeWeapon: function(){
        this._type = Loot.Equipment.Type.WEAPON;
        return this;
    },
    type(value){
        return Util.setOrGet(this, "_type", value);
    },
    level: function(value){
        return Util.setOrGet(this, "_level", value);
    }
}
Loot.Equipment.Type = {
    BODY_ARMOR : "BODY_ARMOR",
    HEAD_ARMOR : "HEAD_ARMOR",
    GLOVES: "GLOVES",
    LEG_ARMOR: "LEG_ARMOR",
    WEAPON: "WEAPON",
    UNDEFINED: "UNDEFINED"
}
