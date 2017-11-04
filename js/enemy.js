function Zombie(){
    this._stats = new Stats();
}
Zombie.prototype = {
    stats: function(value){
        return Util.setOrGet(this, '_stats', value);
    },
    name: function(){
        return "Zombie"; // TODO Placeholder
    }
}
