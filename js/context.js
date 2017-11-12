/**
 * Create a new holder Object for the game with all needed informations
 * @constructor
 * @param {object} options 
 */
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
    this._callOnChangeCallbacks = [];
    this._preparedMissions = [];
    this._missionHistory = [];
}

Context.prototype = {
    _onRoundEnd: function(){
        const self = this;
        const removeDead = function(mission){
            mission.getParty().forEach( surv => {
                if(surv.stats().health() <= 0 ){
                    self.removeSurvivor(surv);
                }
            });
        };
        const makeIdle = function(mission){
            mission.getParty().forEach( surv => {
                if(surv.stats().health() > 0){
                    surv.currentState(Survivor.State.Idle);
                }
            });
        };
        const receiveLoot = function(mission, lootList){
            lootList.forEach( loot => self._camp.addToInventory(loot.drop));
        };
        this._preparedMissions.forEach(mission => {
            
            mission.addLootFoundListener( (lootList) => {
                self._camp.addToInventory(lootList); // Camps dont have an inventory anymore. context will hold it. refactoring
            });
            self._missionListener.forEach(listener => listener(mission));
            mission.addMissionSuccessListener( () => {
                removeDead(mission);
                makeIdle(mission);
            });
            mission.addMissionFailedListener( () => {
                removeDead(mission);
            });
            mission.addLootFoundListener( lootList => receiveLoot(mission, lootList) );
            mission.start()
        });
        this._preparedMissions.forEach( mission =>  self._missionHistory.push(mission) );
        this._preparedMissions = [];
        this._notifyUpdate();
    },
    _notifyUpdate: function(){
        this._callOnChangeCallbacks.forEach( callback => callback());
    },
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
        return Util.setOrGet(this, "_extraordinaryLootTable",value);
    },
    rareLootTable: function(value){
        return Util.setOrGet(this, "_rareLootTable",value);
    },
    buildings: function(value){
        return Util.setOrGet(this, '_buildings', value);
    },

    /**
     * @param {Camp|null} value
     * @returns {Context|Camp}
     */
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
    forceMission: function(party, location, modifier){
        modifier = modifier || new LocationAttributes();
        const self = this;
        const mission = new Mission({
            party: party,
            environment: location,
            modifier: modifier,
            extraordinaryLootTable: self.extraordinaryLootTable,
            commonLootTable: self._commonLootTable,
            rareLootTable: self._rareLootTable
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
            console.log("------------------------------------------------------------------------");
            console.log(mission.getMissionReport());
        });
        mission.addMissionFailedListener( () => {
            console.log("------------------------------------------------------------------------");
            console.log(mission.getMissionReport());
        });
        mission.addLootFoundListener( (lootList) => {
            self._camp.addToInventory(lootList);
        });
        this._missionListener.forEach(listener => listener(mission));
        mission.start();
        return mission;
    },

    /**
     * Creates a new mission that will be added to the preparedMissions
     * and will be started on round end.
     * 
     * @param {[Survivor]} party The selected Survivors for the mission
     * @param {Location} selectedLocation The location that will be used for the mission
     * @param {LocationAttributes} gameModifier Optinal modifier. If not used defaults will be applied
     * @returns {Mission}
     */
    createMission: function(party, selectedLocation, gameModifier){
        gameModifier = gameModifier || new LocationAttributes();
        const self = this;
        const mission = new Mission({
            party: party,
            environment: selectedLocation,
            modifier: gameModifier,
            extraordinaryLootTable: self._extraordinaryLootTable,
            commonLootTable: self._commonLootTable,
            rareLootTable: self._rareLootTable
        });
        this.addPreparedMission(mission);
        return mission;
    },
    addSurvivor: function(survivor){
        this._survivors.push(survivor);
        this._notifyUpdate();
        return this;
    },
    removeSurvivor: function(survivor){
        const index = this._survivors.indexOf(survivor);
        if(index !== -1){
            this._survivors.splice(index,1);
        }
        this._notifyUpdate();
        return this;
    },

    /**
     * Returns all survivors bound the this context;
     * @return {[Survivor]}
     */
    survivors: function(){
        return this._survivors;
    },

    /**
     * Getter or setter for the used mission map
     * @param {MissionMap} value The new mission map | Optional
     * @return {MissionMap|Context} 
     */
    missionMap: function(value){
        return Util.setOrGet(this, "_missionMap", value);
    },
    /**
     * Adds a listener to the context that will be called for every state in the game.
     * Useful for updating UI-Content. Caller is responsible for filtering.
     * @param {function} callback
     */
    addChangeListener: function(callback){
        this._callOnChangeCallbacks.push(callback);
    },

    /**
     * Adds a mission that will be started if the rounds end.
     * The mission can sill be modified/removed before round end.
     * After the mission got fired it will be removed automatically.
     * @param {Mission} mission 
     * @returns {Context}
     */
    addPreparedMission: function(mission){
        this._preparedMissions.push(mission);
        mission.getParty().forEach(surv => surv.currentState(Survivor.State.Preparing) );
        this._notifyUpdate();
        return this;
    },

    getPreparedMissions: function(){
        return this._preparedMissions;
    },

    removePreparedMission: function(mission){
        const index = this._preparedMissions.findIndex(mission);
        if(index === -1){
            this._preparedMissions.splice(index,1).forEach(surv => surv.currentState(Survivor.State.Preparing) );
        }
        return this;
    },

    /**
     * Ends the current round.
     * Will fire all onRoundEnd callbacks
     * 
     * @returns {Context}
     */
    endRound: function(){
        this._onRoundEnd();
        this._windowManager.render();
        return this;
    },

    getMissionHistory: function(){
        return this._missionHistory;
    },

    clearMissionHistory: function(){
        this._missionHistory = [];
    }

}
