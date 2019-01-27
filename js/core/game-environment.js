import { GameCalculator } from "./game-calculator.js";
import { Combat } from "../combat/combat.js";
import { Team } from "../mission/team.js";
import { MissionParameters } from "../mission/mission-parameters.js";
import { Random } from "../math/random.js";
import { GameConstants } from "./game-constants.js";
import { Zombie } from "../combat/zombie.js";
import { MissionMap } from "../mission/mission-map.js";
import { Location } from "../mission/location.js";
import { Survivor, SurvivorCombatantWrapper } from "./survivor.js";
import { MissionBuilder } from "../mission/mission-builder.js";
import { LootDispatcher } from "../mission/loot-dispatcher.js";
import { LootTable } from "../loot-system/loot-table.js";
import { SurvivorMission } from "../mission/survivor-mission.js";
import { SurvivorCamp } from "./survivor-camp.js";
import { LootHander } from "../loot-system/loot-system.js";
import { collectresources } from "../loot-system-v2/loot-collector.js";

export class GameEnvironment {
    constructor(){
        this._calculator = new GameCalculator({
            addativeModifiersOn: false
        });
        const seed = Date.now() % 0x7FFFFFFF;
        console.debug(`seed:=${seed}`);
        this._randomNumberGenerator = new Random(seed);
        this._missionMap = new MissionMap(5,5);

        /**@type {Survivor[]} */
        this._survivors = [];
        
        /**@type {SurvivorMission[]} */
        this._activeMissions = [];

        /**@type {SurvivorMission[]} */
        this._missionHistory = [];

        /**@type {Set<Team>} */
        this._savedTeams = new Set();


        this._camp = new SurvivorCamp();

        this._randomPortraits = [];
        this._init = false;

        /**@type { ((game:GameEnvironment, listener:function)=>void)[] } */
        this._initListener = [];

        /**@type { ((game:GameEnvironment, listener:function)=>void)[] } */
        this._roundEndListener = [];

        /**@type { ((game:GameEnvironment, survivor:Survivor, listener:function)=>void)[] } */
        this._survivorStateChangeListener = [];

        /**@type { ((game:GameEnvironment, survivor:Survivor, listener:function)=>void)[] } */
        this._survivorAddedListener = [];

        /**@type { ((game:GameEnvironment, survivor:Survivor, listener:function)=>void)[] } */
        this._survivorRemovedListener = [];

    }

    _updateMissions(){
        const finishedMissions = this._activeMissions.filter(m => m.isFinished());
        finishedMissions.forEach(m => {
            const index = this._activeMissions.indexOf(m);
            this._activeMissions.splice(index,1);

            if(m.getMissionState() === SurvivorMission.State.FINISHED){
                const res = collectresources(m.getFoundLoot());
                console.log("succesful mission");
                console.log(m.getFoundLoot());
                this._camp.getFoodStock().add(res.food);
                this._camp.getMetalStock().add(res.metal);
                this._camp.getWoodStock().add(res.wood);
                
                const lootHandler = new LootHander();

                m.getActiveSurvivors().forEach(s => s.state = Survivor.States.IDLE);
                
            } else {
                console.log("failed mission");
            }
            this._missionHistory.push(m);
        });
        this._activeMissions.forEach(m => m.passTime());
        
        
    }

    calculator(){
        return this._calculator;
    }

    getRandomPortrait(){
        const index = this._randomNumberGenerator.inBetween(0, this._randomPortraits.length);
        console.debug(index);
        return this._randomPortraits[index];
    }

    set randomPortraits(list){
        this._randomPortraits = list;
    }

    get randomNumberGenerator(){
        return this._randomNumberGenerator;
    }

    /**
     * @param {Random} rng
     */
    set randomNumberGenerator(rng){
        this._randomNumberGenerator = rng;
    }

    /**
     * 
     * @param {Team[]} teams 
     * @param {Location} location 
     * @param {MissionParameters} modifiers 
     * @param {SurvivorMission} sourceMission 
     */
    startBattle(teams, location, modifiers, ambush = false, sourceMission = null){
        const startingDist = ambush ? modifiers.range.base()/2 : modifiers.range.base(); //TODO: survivor awareness value
        const combat = new Combat(
            this._randomNumberGenerator,
            startingDist,
            GameConstants.COMBAT.ZOMBIE_DISTANCE_PER_ROUND
        );
        teams.forEach(team => combat.addSurvivor(...team.getLivingMembers().map( s => new SurvivorCombatantWrapper(s)) ));
        const zeds = this._randomNumberGenerator.inBetween(modifiers.zombies.min(), modifiers.zombies.max() );
        for(let i = 0; i <= zeds; ++i){
            const enemy = new Zombie();
            combat.addEnemy(enemy);
        }
        if(sourceMission) {
            sourceMission.addCombat(combat);
        }
        combat.start();

        return combat;
    }

    getMissionMap(){
        return this._missionMap;
    }

    /**
     * Returns all available survivors.
     * Available means IDLE state and not dead.
     */
    getAvailableSurvivors(){
        return this._survivors.filter( s => s.isAvailable() );
    }

    /**
     * Returns all survivors that are still alive ignoring their state or if they are on mission.
     */
    getAllAliveSurivors() {
        console.log("what", this._survivors);
        return this._survivors.filter( s => s.isAlive());
    }

    /**
     * 
     * @param {...Survivor} survivor 
     */
    addSurvivor(...survivor) {
        this._survivors.push(...survivor);
        survivor.forEach(s =>  {

            s.onstateChange( s => {
                this._survivorStateChangeListener.forEach( l => {
                    l(this, s, l);
                });
            });
            
            this._survivorAddedListener.forEach( l => {
                l(this,s,l);
            });
     
        });
    }

    createRandomSurvivor(name){
        const rng = this._randomNumberGenerator;
        const s = new Survivor();
        s.name(name);
        s.portrait = this.getRandomPortrait();
        s.getMissionModifiers().fill(1);
            //.forEach( (x,y) => s.getMissionModifiers().setCell(x,y, rng.inBetween(0.5,2) ) );

        s.combatstats.forEach( (x,y) => s.combatstats.setCell(x,y, rng.inBetween(5, 50) ));
        return s;
    }

    createDefaultMissionBuilder(){
        const builder = new MissionBuilder();
        builder.setCombatStarter((m,a) => {
            this.startBattle(
                m.getTeams(),
                m.getTargetLocation(),
                m.modifier,
                a,
                m
            );
        });
        builder.setRNG(this._randomNumberGenerator);
        return builder;
    }

    /**
     * 
     * @param {SurvivorMission} mission 
     */
    addNewMission(mission){
        this._activeMissions.push(mission);
        mission.start();
    }

    getActiveMissions(){
        return this._activeMissions;
    }

    endRound(){
        this._updateMissions();
        this._roundEndListener.forEach( l => l(this,l));
    }

    getCamp(){
        return this._camp;
    }

    saveTeam(team){
        this._savedTeams.add(team);
    }

    getSavedTeams(){
        return [...this._savedTeams];
    }

    getMissionHistory(){
        return this._missionHistory;
    }

    isInit(){
        return this._init;
    }

    /**
     * 
     * @param { (game:GameEnvironment, listener:function)=>void } callback 
     */
    onready(callback){
        if(this._init){
            callback(this, callback);
        } else {
            this._initListener.push(callback);
        }
    }

    onroundEnd(callback) {
        this._roundEndListener.push(callback);
    }

    onsurvivorStateChange(callback) {
        this._survivorStateChangeListener.push(callback);
    }

    onsurvivorAdded(callback) {
        this._survivorAddedListener.push(callback);
    }

    onsurvivorRemoved(callback) {
        this._survivorRemovedListener.push(callback);
    }

    start(){
        this._initListener.forEach( c => c(this,c));
        this._initListener = [];
    }
}

export const ENVIRONMENT = new GameEnvironment();


