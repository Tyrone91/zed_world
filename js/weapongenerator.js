WeaponTemplate = {
    AK_74: {
        accuracy: Range.of(15,35),
        silence: Range.of(0,5),
        speed: Range.of(4,12),
        health: Range.of(0,0),
        armor: Range.of(0,0),
        awareness: Range.of(0,0),
        upperOptimalRange: Range.of(25,35),
        lowerOptimalRange: Range.of(15,18),
        upperDamage: Range.of(16,25),
        lowerDamage: Range.of(11,16)
    },
    HUNTING_RIFLE: {
        accuracy: Range.of(45,75),
        silence: Range.of(0,10),
        speed: Range.of(1,2),
        health: Range.of(0,0),
        armor: Range.of(0,0),
        awareness: Range.of(0,0),
        upperOptimalRange: Range.of(50,75),
        lowerOptimalRange: Range.of(40,49),
        upperDamage: Range.of(10,15),
        lowerDamage: Range.of(10,10)
    },
    M4: {
        accuracy: Range.of(30,45),
        silence: Range.of(0,15),
        speed: Range.of(5,10),
        health: Range.of(0,0),
        armor: Range.of(0,0),
        awareness: Range.of(0,0),
        upperOptimalRange: Range.of(35,50),
        lowerOptimalRange: Range.of(15,25),
        upperDamage: Range.of(10,12),
        lowerDamage: Range.of(5,10)
    }
}

WeaponGenerator = {
    _between: function(range){
        return Util.randomIntInclusive(range.lower(), range.upper());
    },
    _ajustToLevel: function(level, value){
        return Math.floor(value * (1 + level * 0.1));
    },
    randomItem: function(id, level, source){
        let accuracy = this._between(source.accuracy);
        let silence = this._between(source.silence);
        let speed = this._between(source.speed);
        let health = this._between(source.health);
        let armor = this._between(source.armor);
        let awareness = this._between(source.awareness);

        let upperRange = this._between(source.upperOptimalRange);
        let lowerRange = this._between(source.lowerOptimalRange);

        let upperDamage = this._between(source.upperDamage);
        let lowerDamage = this._between(source.lowerDamage);

        const res = new Loot.Equipment(id, "AUTO_GENERATED_ITEM", level);
        res.stats()
        .accuracy(this._ajustToLevel(level, accuracy))
        .silence(this._ajustToLevel(level, silence))
        .speed(this._ajustToLevel(level, speed))
        .health(this._ajustToLevel(level, health))
        .armor(this._ajustToLevel(level, armor))
        .awareness(this._ajustToLevel(level, awareness))
        .damage(Range.of(this._ajustToLevel(level, lowerDamage),this._ajustToLevel(level, upperDamage)))
        .optimalRange(Range.of(lowerRange,this._ajustToLevel(level, upperRange))); //FIXME A lower optimalrange is good. but the adjust function  would increase it

        return res;
    },
    randomM4: function(level){
        const id = 0;
        return this.randomItem(id, level, WeaponTemplate.M4).makeWeapon().name("M4");
    },
    randomAk47: function(level){
        const id = 0;
        return this.randomItem(id, level, WeaponTemplate.AK_74).makeWeapon().name("AK 47");
    },
    randomMP7: function(level){

    },
    randomHuntingRifle: function(level){
        const id = 0;
        return this.randomItem(id, level, WeaponTemplate.HUNTING_RIFLE).makeWeapon().name("Hunting Rifle");
    }
}
