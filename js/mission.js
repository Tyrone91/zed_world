function Mission(options){
    /**
     * [_missionModifier description]
     * @type {LocationAttributes}
     */
    this._missionModifier = options.modifier || new LocationAttributes();
    this._environment = options.environment || null;
    this._party = options.party || null;
    this._missionLength = options.length;
    this._commonLootTable = options.commonLootTable || new LootTable();
    this._rareLootTable = options.rareLootTable || new LootTable();
    this._exordinaryLootTable = options.exordinaryLootTable || new LootTable();
    this._encounterFactory = options.encounterFactory || function(party, enemies, environment){
        return new Encounter(party, enemies, environment);
    };
    this._missionSuccessListener = [];
    this._missionFailedListener = [];
    this._encounterHappensListener = [];
    this._lootFoundListener = [];
}

Mission.prototype = {
    _createEnemies(min,max){
        const zombieRoll = Util.randomIntInclusive(min,max);
        const res = [];
        for(let i = 0; i < zombieRoll; ++i){
            res.push(new Zombie());
        }
        return res;
    },
    environment: function(value){
        return Util.setOrGet(this, "_environment", value);
    },
    commonLootTable: function(value){
        return Util.setOrGet(this, "_commonLootTable", value);
    },
    rareLootTable: function(value){
        return Util.setOrGet(this, "_rareLootTable", value);
    },
    extraordinaryLootTable: function(value){
        return Util.setOrGet(this, "_exordinaryLootTable", value);
    },
    encounterFactory: function(value){
        return Util.setOrGet(value);
    },
    addMissionSuccessListener: function(callback){
        this._missionSuccessListener.push(callback);
        return this;
    },
    addMissionFailedListener: function(callback){
        this._missionFailedListener.push(callback);
        return this;
    },
    addLootFoundListener: function(callback){
        this._lootFoundListener.push(callback);
        return this;
    },
    addEncounterListener: function(callback){
        this._encounterHappensListener.push(callback);
        return this;
    },
    start: function(){
        const self = this;
        Util.require(this._party, "Mission: Can't start mission without a party");
        Util.require(this._environment, "Mission: Can't start mission without an environment");
        Util.require(this._encounterFactory, "Mission: Can't start mission without an encounter-factory");

        const missionValues = this._missionModifier.duplicate().apply(this._environment.attributes());
        const encounterRoll = Util.randomIntInclusive(0,100);
        const encounterHappens = encounterRoll < missionValues.encounterChance();

        const commonLootRoll = Util.randomIntInclusive(0,100);
        const rareLootRoll = Util.randomIntInclusive(0,100);
        const extraordinaryLootRoll = Util.randomIntInclusive(0,100);
        const lootHappens = commonLootRoll < missionValues.commonItemDropChance() || rareLootRoll < missionValues.rareItemDropChance() || extraordinaryLootRoll < missionValues.extraordinaryItemDropChance();

        const onSuccessfulMission = function(){
            if(lootHappens){
                const lootList = [];
                if(commonLootRoll < missionValues.commonItemDropChance() ){
                    lootList.push(self._commonLootTable.roll());
                }
                if(rareLootRoll < missionValues.rareItemDropChance() ){
                    lootList.push(self._rareLootTable.roll());
                }
                if(extraordinaryLootRoll < missionValues.extraordinaryItemDropChance() ){
                    lootList.push(self._exordinaryLootTable.roll());
                }
                self._lootFoundListener.forEach(listener => listener(lootList));
            }
            self._missionSuccessListener.forEach(listener => listener(self));
        }
        if(encounterHappens){
            const enemies = this._createEnemies(missionValues.minZombieCount(), missionValues.maxZombieCount());
            const encounter = this._encounterFactory(this._party, enemies, this._environment);
            this._encounterHappensListener.forEach( listener => listener(encounter));
            const listener = new Encounter.Listener();
            listener.onDefeat = function(){
                self._missionFailedListener.forEach(listener => listener(self));
            }
            listener.onVictory = function(){
                onSuccessfulMission();
            }
            encounter.addListener(listener);
            encounter.start();
        }else{
            onSuccessfulMission();
        }
    },
    update: function(elapsedTime){

    }
}
