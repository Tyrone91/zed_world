
/**
 * Handler for encounters between surivors and enemies.
 * @param       {array} party       The surivor party. If everyone dies the encounter is over
 * @param       {array} enemies     The enemies. If everyone dies the encounter is over
 * @param       {Location} environment The environment of the battle. Changes stats etc.
 * @constructor
 */
function Encounter(party, enemies, environment){
    const self = this;
    this._party = party.slice();
    this._environment = environment;
    this._enemies = enemies;
    this._listeners = [];

    const newRoundsummaryListener = new Encounter.Listener();
    newRoundsummaryListener.onNewRound = function(summary){
        console.log("summary called");
        console.log(summary);
    };
    this.addListener(newRoundsummaryListener);


    const endTurnListener = new Encounter.Listener();
    this._endTurnData = {
        survivorsKilled: 0,
        enemiesKilled: 0,
        totalDamage: 0
    };
    endTurnListener.onDamage = function(encounter, aggressor, target, damage){
        self._endTurnData.totalDamage += damage;
    };
    endTurnListener.onDeath = function(encounter, killedSurvivor, aggressor){
        self._endTurnData.survivorsKilled++;
    };
    endTurnListener.onKill = function(encounter, survivor, target){
        self._endTurnData.enemiesKilled++;
    };
    endTurnListener.onNewRound = function(summary){
        self._endTurnData = {
            survivorsKilled: 0,
            enemiesKilled: 0,
            totalDamage: 0
        };
    };
    this.addListener(endTurnListener);
}

Encounter.prototype = {
    _notifyListener: function(functionName){
        return Util.onEach(this._listeners, functionName);
    },
    _notifyDmageInflicted: function(aggressor, target, damage){
        this._notifyListener('onDamage')(this,aggressor, target, damage);
    },
    _notifySurvivorDeath: function(survivor, aggressor){
        this._notifyListener('onDeath')(this,survivor,aggressor);
    },
    _notifyZombieKill: function(survivor, target){
        this._notifyListener('onKill')(this,survivor,target);
    },
    _notifyNewRound: function(distance){
        const summary = {
            survivor: this._party.slice(),
            enemies: this._enemies.slice(),
            distance: distance
        };
        this._notifyListener('onNewRound')(this, summary);
    },
    _notifyVictory: function(){
        this._notifyListener('onVictory')(this);
    },
    _notifyDefeat: function(){
        this._notifyListener('onDefeat')(this);
    },
    _notifyAmbush: function(){
        this._notifyListener('onAmbush')(this);
    },
    _notifySurvivorAttack: function(survivor, target, hitchance, range, optimalRange, missed){
        const summary = {
            range: range,
            optimalRange: optimalRange,
            survivor: survivor,
            target: target,
            hitchance: hitchance,
            missed: missed
        }
        this._notifyListener("onSurvivorAttack")(this, summary);
    },
    _notifyRoundEnd: function(){
        const summary = {
            enemiesKilled : this._endTurnData.enemiesKilled,
            survivorsKilled : this._endTurnData.survivorsKilled,
            totalDamage : this._endTurnData.totalDamage,
        };
        this._notifyListener('onRoundEnd')(this, summary);
    },
    _calculateStartingDistance: function(){
        const awarenessAvg = this._summedUpAwareness() / this._partySize();
        console.log("avg awareness: " + awarenessAvg);
        const modifiedAwareness = Util.randomIntInclusive(awarenessAvg - (awarenessAvg * 0.1), awarenessAvg + (awarenessAvg * 0.1));
        console.log("modified awareness: " + modifiedAwareness);
        const visibility = this._environment.attributes().visibilityReduction();
        const modifiedVisibility = Util.randomIntInclusive(visibility - (visibility * 0.1), visibility + (visibility * 0.1));
        console.log("modifiedVisibilty " + modifiedVisibility);
        let range = this._environment.attributes().startingRange();
        const diff = modifiedVisibility - modifiedAwareness;
        console.log("diff: " + diff);
        if(diff <= 0){
            return range;
        }
        const modifiedDiff = Math.pow(diff,1.2);
        console.log("modifieddiff: " + modifiedDiff);
        const pivot = Util.randomIntInclusive(0,100);
        console.log("pivot: " + pivot);
        if( pivot < modifiedDiff){
            console.log("AMBUSH");
            this._notifyAmbush();
            return range / 2;
        }
        return range;
    },
    _partySize: function(){
        return this._party.length;
    },
    _summedUpAwareness: function(){
        let sum  = 0;
        this._party.forEach(survivor => sum += survivor.stats().awareness());
        return  sum;
    },
    _alive: function(team){
        let value = false;
        team.forEach( member => {
            if(member.stats().health() > 0 ){
                value = true;
            }
        });
        return value;
    },
    _over: function(){
        return !this._alive(this._party) || !this._alive(this._enemies);
    },
    _accuracyPenalty(range, optimalRange){
        if(optimalRange.lower() <= range && range <= optimalRange.upper() ){
            return 0;
        }
        const anchorRange = optimalRange.upper() < range ? optimalRange.upper() : optimalRange.lower();
        const difference = Math.abs(anchorRange - range);
        return Math.pow(difference, 1.2);
    },
    _calculateDamage: function(survivor, target){
        const dmgRange = survivor.stats().damage();
        const dmg = Util.randomIntInclusive(dmgRange.lower(), dmgRange.upper()); //Only integer dmg no floats
        const newHp = target.stats().health() - dmg;
        this._notifyDmageInflicted(survivor, target, dmg);
        if(newHp < 0 ){
            const indexOf = this._enemies.indexOf(target);
            this._enemies.splice(indexOf,1);
            this._notifyZombieKill(survivor, target);
        }
        target.stats().health(newHp < 0 ? 0 : newHp);
    },
    _evalRound: function(range){
        const self = this;
        this._party.forEach(member => {
            const optimalRange = member.stats().optimalRange();
            const damageRange = member.stats().damage();
            const accuracy = member.stats().accuracy();
            let leftActions = member.stats().speed();
            while(leftActions > 0 && !self._over()){
                const index = Math.floor(Math.random() * self._enemies.length);
                const target = self._enemies[index]; //FIXME: Pick random target for now and delete enemie from array or check for health
                let hitChance = accuracy - self._accuracyPenalty(range,optimalRange);
                hitChance = hitChance < 1 ? 1 : hitChance;
                if(Util.randomIntInclusive(0,100) <= hitChance){
                    self._notifySurvivorAttack(member,target, hitChance, range, optimalRange, false);
                    self._calculateDamage(member, target);
                }else{
                    self._notifySurvivorAttack(member,target, hitChance, range, optimalRange, true);
                }
                --leftActions;
            }
        });

        const doZombieDmg = range <= 0;
        if(doZombieDmg){

        }
    },
    _inflictZombieDmg: function(){
        const self = this;
        this._enemies.forEach(zed => {
            let actionsLeft = zed.stats().speed();
            //TODO: Give Survivors a chance to evade
            while(actionsLeft > 0 && !self._over()){
                const dmgRange = zed.stats().damage();
                const dmg = Util.randomIntInclusive(dmgRange.lower(), dmgRange.upper());
                const index = Math.floor(Math.random() * self._party.length);
                const target = self._party[index];
                const newHp = target.stats().health() - dmg;
                if(newHp <= 0){
                    const indexOf = self._party.indexOf(target);
                    self._party.splice(indexOf,1);
                    self._notifySurvivorDeath(target, zed);
                }
                target.stats().health(newHp);
                --actionsLeft
            }
        });
    },
    addListener(listener){
        this._listeners.push(listener);
    },
    enemiesLeft: function(){
            return this._enemies.length;
    },
    start: function(){
        const ZOMBIE_SPEED = 7.5; //TODO: Make something cool. Maybe Perk to reduce zombie speed, give modifiers like hungry horde +10% more speed etc.
        const startingRange = this._calculateStartingDistance();
        let currentRange = startingRange;
        let roundIndex = 1;
        while(!this._over()){
            this._notifyNewRound(currentRange);
            this._evalRound(currentRange);
            if(currentRange > 0 ){
                currentRange -= ZOMBIE_SPEED;
                if(currentRange < 0){
                    currentRange = 0;
                }
            }else{
                this._inflictZombieDmg();
                currentRange = 0;
            }
            this._notifyRoundEnd();
        }

        if(this._alive(this._enemies)){
            this._notifyDefeat();
        }else{
            this._notifyVictory();
        }
    }
}
Encounter.Listener = function(){}
Encounter.Listener.prototype = {
    onDeath: function(encounter,killedSurvivor,aggressor){},
    onKill: function(encounter,survivor,target){},
    onNewRound: function(encounter, summary){},
    onDamage: function(encounter,aggressor, target, damage){},
    onRoundEnd: function(encounter,summary){},
    onAmbush: function(encounter){},
    onSurvivorAttack: function(encounter, summary){},
    onVictory: function(encounter){},
    onDefeat: function(encounter){}
}
