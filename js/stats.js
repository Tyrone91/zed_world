
/**
 * Range Object
 * @param       {number} lower lower boundry of the range
 * @param       {number} upper upper boundry of the range
 * @constructor
 */
function Range(lower, upper){
    this._lower = lower;
    this._upper = upper;
}
Range.prototype = {
    lower: function(value){
        return Util.setOrGet(this,"_lower",value);
    },
    upper: function(value){
        return Util.setOrGet(this,"_upper",value);
    },
    toString: function(){
        return "["+this._lower+"-"+this._upper+"]"
    },
    average: function(){
        return (this._lower + this._upper) / 2;
    },
    /**
     * Returns a boolean depentend if the given number lies in the range.
     * Lower inlusive - upper inclusive
     * @param  {number} value [description]
     * @return {boolean}       [description]
     */
    inBetween: function(value){
        return this._lower >= value && value <= this._upper;
    },
    /**
     * Returns the difference between lower and upper
     * @return {number} [description]
     */
    span: function(){
        return this._upper - this._lower;
    }
}
Range.of = function(lower,upper){
    return new Range(lower,upper);
}


function Stats(){
    this._silence = 10;
    this._accuracy = 20;
    this._damage = new Range(5,10);
    this._hp = 5;
    this._armor = 2;
    this._awareness = 15;
    this._speed = 2;
    this._optimalRange = new Range(0,10);
}
Stats.prototype = {
    silence: function(value){
        return Util.setOrGet(this, '_silence', value);
    },
    accuracy: function(value){
        return Util.setOrGet(this, '_accuracy', value);
    },
    /**
     * Returns the damage range of this stats object.
     * @param  {Range} value Optional damage range. Leave empty to use the function as getter
     * @return {Range|this}   This if used as a setter or the actual range if used as getter
     */
    damage: function(value){
        return Util.setOrGet(this, '_damage', value);
    },
    health: function(value){
        return Util.setOrGet(this, '_hp', value);
    },
    armor: function(value){
        return Util.setOrGet(this, '_armor', value);
    },
    awareness: function(value){
        return Util.setOrGet(this, '_awareness', value);
    },
    speed: function(value){
        return Util.setOrGet(this, '_speed', value);
    },
    optimalRange(value){
        return Util.setOrGet(this, '_optimalRange', value);
    },
    combine: function(stats){
        this._iterateEntries(stats, (x,y) => x + y);
    },
    reduce: function(stats){
        this._iterateEntries(stats, (x,y) => x - y);
    },
    _iterateEntries(stats, operator){
        this._silence = operator(this._silence, stats._silence);
        this._accuracy = operator(this._accuracy, stats._accuracy);
        this._hp = operator(this._hp, stats._hp);
        this._armor = operator(this._armor, stats._armor);
        this._awareness = operator(this._awareness, stats._awareness);
        this._speed = operator(this._speed, stats._speed);

        const lowerDmg = operator(this._damage.lower(), stats._damage.lower());
        const upperDmg = operator(this._damage.upper(), stats._damage.upper());
        this._damage.lower(lowerDmg).upper(upperDmg);

        const lowerRange = operator(this._optimalRange.lower(), stats._optimalRange.lower());
        const upperRange = operator(this._optimalRange.upper(), stats._optimalRange.upper());
        this._optimalRange.lower(lowerRange).upper(upperRange);
    }
}
