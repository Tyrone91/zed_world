function Survivor(id, name, stats){
    this._id = Util.require(id);
    this._name = Util.require(name);
    this._stats = stats || new Stats();
    this._state = Survivor.State.Idle;
    this._headEquipment = null;
    this._bodyEquipment = null;
    this._glovesEquipment = null;
    this._legEquipment = null;
    this._mainWeapon = null;

}

Survivor.State = {
    Idle: 'IDLE',
    Training: 'TRAINING',
    OnMission: 'ONMISSION'
}

Survivor.prototype = {
    stats: function(value){
        return Util.setOrGet(this, '_stats', value);
    },
    id: function(){
        return this._id;
    },
    name: function(value){
        return Util.setOrGet(this, '_name', value);
    },
    currentState: function(value){
        return Util.setOrGet(this, "_state", value);
    },
    headEquipment: function(value){
        return Util.setOrGet(this, "_headEquipment", value);
    },
    bodyEquipment: function(value){
        return Util.setOrGet(this, "_bodyEquipment", value);
    },
    glovesEquipment: function(value){
        return Util.setOrGet(this, "_glovesEquipment", value);
    },
    legEquipment: function(value){
        return Util.setOrGet(this, "_legEquipment", value);
    },
    mainWeapon: function(value){
        return Util.setOrGet(this, "_mainWeapon", value);
    },
    isDead: function(){
        return this._stats.health() <= 0;
    }

}
