function Context(options){
    const self = this;
    options = options || {};
    this._camp = new Camp(Util.valueOr(options.campName,"Default Camp Name"));
    this._buildings = options.buildings || this._defaultBuildings();
    this._buildings.forEach( building => self._camp.bindBuilding(building) );
    this._commonLootTable = options.commonLootTable || new LootTable();
    this._extraordinaryLootTable = options.extraordinaryLootTable || new LootTable();
    this._rareLootTable = options.rareLootTable || new LootTable();
    this._missionListener = [];
    this._survivors = [];
    this._missionMap = options.missionMap || new MissionMap();
    this._windowManager = options.windowManager || new WindowManager();
}

Context.prototype = {
    _defaultBuildings: function(){
        return [
            new Buildings.Mill(1).level(1),
            new Buildings.Storage().level(1),
            new Buildings.Quarry().level(1),
            new Buildings.Quarters().level(1),
            new Buildings.ShootingRange().level(0),
            new Buildings.ShootingRange().level(0),
            new Buildings.CommandCenter().level(0)
        ];
    },
    windowManager: function(value){
        return Util.setOrGet(this, "_windowManager", value);
    },
    commonLootTable: function(value){
        return Util.setOrGet(this, "_commonLootTable",value);
    },
    extraordinaryLootTable: function(value){
        return Util.setOrGet(this, ":extraordinaryLootTable",value);
    },
    rareLootTable: function(value){
        return Util.setOrGet(this, "_rareLootTable",value);
    },
    buildings: function(value){
        return Util.setOrGet(this, '_buildings', value);
    },
    camp: function(value){
        return Util.setOrGet(this,'_camp', value);
    },
    update: function(){
        console.log("context-update");
        this._camp.update();
        console.log(this._camp.resourcesAsArray());
    },
    addMissionListener: function(callback){
        this._missionListener.push(callback);
    },
    forceMission(party, location, modifier){
        modifier = modifier || new LocationAttributes();
        const self = this;
        const mission = new Mission({
            party: party,
            environment: location,
            modifier: modifier,
            extraordinaryLootTable: this._exordinaryLootTable,
            commonLootTable: this._commonLootTable,
            rareLootTable: this._rareLootTable
        });
        mission.addEncounterListener(encounter => {
            encounter.addListener({
                onRoundEnd: function(encounter, summary){
                    console.log(summary);
                },
                onSurvivorAttack: function(encounter, summary){
                    const missed = "[" + (summary.missed ? "MISSED" : "HITS") + "]";
                    console.log("Survivor " + summary.survivor.name() + " attacks at range "+summary.range+". Optional range is "+summary.optimalRange.toString()+"with base accuracy of "+summary.survivor.stats().accuracy()+"% Hitchance " + summary.hitchance + "%. " + missed + " raw: " + summary.missed);
                },
                onDamage: function(encounter, aggressor, target, damage){
                    console.log(aggressor.name() + " inflicted "+damage+" damage");
                }
            });
        });
        mission.addMissionSuccessListener( () => {

        });
        mission.addLootFoundListener( (lootList) => {
            self._camp.addToInventory(lootList);
        });
        this._missionListener.forEach(listener => listener(mission));
        mission.start();
    },
    addSurvivor: function(survivor){
        this._survivors.push(survivor);
        return this;
    },
    remvoeSurvivor: function(survivor){
        const index = this._survivors.indexOf(survivor);
        if(index !== -1){
            this._survivors.splice(index,1);
        }
        return this;
    },
    survivors: function(){
        return this._survivors;
    },

    missionMap: function(value){
        return Util.setOrGet(this, "_missionMap", value);
    }

}
