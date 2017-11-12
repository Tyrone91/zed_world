function Mission(options){
    /**
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
    this._missionReport = new MissionReport(this);
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
    getMissionReport: function(){
        return this._missionReport;
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
                const collect = function(value){
                    if(value){
                        lootList.push(value);
                    }
                }
                if(commonLootRoll < missionValues.commonItemDropChance() ){
                    collect(self._commonLootTable.roll());
                }
                if(rareLootRoll < missionValues.rareItemDropChance() ){
                    collect(self._rareLootTable.roll());
                }
                if(extraordinaryLootRoll < missionValues.extraordinaryItemDropChance() ){
                    collect(self._exordinaryLootTable.roll());
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
    getParty: function(){
        return this._party;
    }
}

/**
 * 
 * @param {Mission} source 
 */
function MissionReport(source){
    this._source = source;
    this._lootResult = null;
    this._enemiesKilld = 0;
    this._survivorsKilled = 0;
    this._details = [];
    this._missionState = "SUCCESSFUL";
    const self = this;
    source.addMissionFailedListener( () => self._missionState = "FAILED");
    source.addMissionSuccessListener( () => self._missionState = "SUCCESSFUL");
    source.addLootFoundListener( (lootList) => self._lootResult = lootList ? lootList : null );
    source.addEncounterListener( encounter => self._collectEncounterData(encounter));
}

MissionReport.prototype ={
    /**
     * @param {Encounter} encounter
     */
    _collectEncounterData: function(encounter){
        const self = this;
        const listener = new Encounter.Listener();
        listener.onDeath =  () => ++self._survivorsKilled;
        listener.onKill = () => ++self._enemiesKilld;

        let roundSummary = {};
        listener.onNewRound = (e , sum) => {
            roundSummary.distance = sum.distance;
            roundSummary.aliveSurvivors = sum.survivor;
            roundSummary.enemies = sum.enemies;
            roundSummary.actions = [];
        };
        listener.onRoundEnd = () => {
            self._details.push(roundSummary);
            roundSummary = {};
        };
        listener.onSurvivorAttack = (e, summary) => {
            const detail = {
                attacker: summary.survivor.name(),
                range: summary.range,
                target: summary.target.name(),
                optimalRange: summary.optimalRange,
                hitchance: summary.hitchance,
                missed: summary.missed
            };
            roundSummary.actions.push(detail);
        };
        encounter.addListener(listener);
    },
    hasLoot: function(){
        return this._lootResult != null;
    },
    getLoot: function(){
        return this._lootResult ? this._lootResult : [];
    },
    getEnemiesKilled: function(){
        return this._enemiesKilld
    },
    getSurvivorsKilled: function(){
        return this._survivorsKilled;
    },
    getRoundDetails: function(){
        return this._details ? this._details : [];
    },
    getMissionState: function(){
        return this._missionState;
    }
}
