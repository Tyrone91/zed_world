import { GameCalculator } from "./game-calculator.js";
import { Combat } from "../combat/combat.js";
import { Team } from "../mission/team.js";
import { MissionParameters } from "../mission/mission-parameters.js";
import { Random } from "../math/random.js";
import { GameConstants } from "./game-constants.js";
import { Zombie } from "../combat/zombie.js";
import { MissionMap } from "../mission/mission-map.js";
import { Location } from "../mission/location.js";
import { Survivor, SurvivorCombatantWrapper } from "./character/survivor.js";
import { MissionBuilder } from "../mission/mission-builder.js";
import { SurvivorMission } from "../mission/survivor-mission.js";
import { SurvivorCamp } from "./survivor-camp.js";
import { WeaponGenerator } from "../equipment/generator/weapon-generator.js";
import { Services } from "./services.js";
import { MissionHandler } from "./mission-handler.js";
import { CharacterCreator } from "./character/charactor-creator.js";
import { LootCollector } from "../loot-system-v3/loot-collector.js";
import { CombatHandler } from "./combat-handler.js";

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
        this._missionHistory = [];

        /**@type {Set<Team>} */
        this._savedTeams = new Set();


        this._camp = new SurvivorCamp();

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

        this._equipmentGenerator = new WeaponGenerator(this._randomNumberGenerator);

        this._services = new Services();

        this._missionHandler = new MissionHandler();

        this._characterCreator = new CharacterCreator(this._randomNumberGenerator);

        this._combatHandler = new CombatHandler(this);

    }

    _updateMissions(){
        const result = this._missionHandler.update();
        const collector = new LootCollector();
        collector.receive(...result.loot.map(wrapper => wrapper.content).reduce( (prev,cur) => [...prev, ...cur], [] ));
        console.log("mission reslult:", result);
        console.log("collecting resources: ", collector.resources);
        collector.resources.food.forEach( res => this._camp.getFoodStock().add(res));
        collector.resources.wood.forEach( res => this._camp.getWoodStock().add(res));
        collector.resources.metal.forEach( res => this._camp.getMetalStock().add(res));

        const equipment = collector.equipment;
        this._camp.getArmory().addEquipment(...equipment);
        
        this._missionHistory.push(...result.finished);
    }

    calculator(){
        return this._calculator;
    }

    get randomNumberGenerator(){
        return this._randomNumberGenerator;
    }

    get services() {
        return this._services;
    }

    get combatHandler() {
        return this._combatHandler;
    }

    /**
     * @param {Random} rng
     */
    set randomNumberGenerator(rng){
        this._randomNumberGenerator = rng;
    }

    get characterCreator() {
        return this._characterCreator;
    }

    /**
     * 
     * @param {Team[]} teams 
     * @param {Location} location 
     * @param {MissionParameters} modifiers 
     * @param {SurvivorMission} sourceMission 
     */
    startBattle(teams, location, modifiers, ambush = false, sourceMission = null){
        const startingDist = ambush ?
            /**@type {number} */(modifiers.range.base())/2 :
            /**@type {number} */( modifiers.range.base()); //TODO: survivor awareness value

        const combat = new Combat(
            this._randomNumberGenerator,
            startingDist,
            GameConstants.COMBAT.ZOMBIE_DISTANCE_PER_ROUND
        );
        teams.forEach(team => combat.addSurvivor(...team.getLivingMembers().map( s => new SurvivorCombatantWrapper(s)) ));
        const zeds = this._randomNumberGenerator.inBetween(modifiers.zombies.min(), /**@type {number} */ (modifiers.zombies.max()) );
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
        this._missionHandler.addMission(mission);
        mission.start();
    }

    getActiveMissions(){
        return this._missionHandler.missions;
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

    getEquipmentGenerator() {
        return this._equipmentGenerator;
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


