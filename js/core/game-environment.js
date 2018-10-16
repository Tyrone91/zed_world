import { GameCalculator } from "./game-calculator.js";
import { Combat } from "../combat/combat.js";
import { Team } from "../mission/team.js";
import { MissionParameters } from "../mission/mission-parameters.js";
import { Random } from "../math/random.js";
import { GameConstants } from "./game-constants.js";
import { Zombie } from "../combat/zombie.js";
import { MissionMap } from "../mission/mission-map.js";
import { Location } from "../mission/location.js";
import { Survivor } from "./survivor.js";
import { MissionBuilder } from "../mission/mission-builder.js";
import { LootDispatcher } from "../mission/loot-dispatcher.js";
import { LootTable } from "../loot-system/loot-table.js";
import { SurvivorMission } from "../mission/survivor-mission.js";

export class GameEnvironment {
    constructor(){
        this._calculator = new GameCalculator({
            addativeModifiersOn: false
        });

        this._randomNumberGenerator = new Random(Date.now() % Number.MAX_SAFE_INTEGER );
        this._missionMap = new MissionMap(5,5, [
            {
                location: new Location("City", "A former glorous City, turned into an undead buffet."),
                x: 0,
                y: 0

            }
        ]);
        
        /**@type {Team[]} */
        this._teams = [];

        /**@type {Survivor[]} */
        this._survivors = [];

        this._survivors.push(
            new Survivor().name("Bob"),
            new Survivor().name("Francis"),
            new Survivor().name("Alex"),
            this.createRandomSurvivor("R1"),
            this.createRandomSurvivor("R2"),
            this.createRandomSurvivor("R3")
        );

        this._survivors[0].getMissionModifiers().range.max(5).base(1).min(3);
        this._survivors[1].getMissionModifiers().range.max(10).base(1).min(5);
        
        /**@type {SurvivorMission[]} */
        this._activeMissions = [];
    }

    _updateMissions(){
        const finishedMissions = this._activeMissions.filter(m => m.isFinished());
        finishedMissions.forEach(m => {
            const index = this._activeMissions.indexOf(m);
            this._activeMissions.splice(index,1);

            if(m.getSurivivors().length > 0){
                console.log("succesful mission");

            } else {
                console.log("failed mission");
            }
        });
        this._activeMissions.forEach(m => m.passTime());
        
    }

    calculator(){
        return this._calculator;
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
     * @param {Mission} sourceMission 
     */
    startBattle(teams, location, modifiers, ambush = false, sourceMission = null){
        const startingDist = ambush ? modifiers.range.base()/2 : modifiers.range.base(); //TODO: survivor awareness value
        const combat = new Combat(
            this._randomNumberGenerator,
            startingDist,
            GameConstants.COMBAT.ZOMBIE_DISTANCE_PER_ROUND
        );
        teams.forEach(team => combat.addSurvivor(...team.getLivingMembers() ));
        const zeds = this._randomNumberGenerator.inBetween(modifiers.zombies.min(), modifiers.zombies.max() );
        for(let i = 0; i <= zeds; ++i){
            const enemy = new Zombie();
            combat.addEnemy(enemy);
        }
    }

    getMissionMap(){
        return this._missionMap;
    }

    getTeams(){
        return this._teams;
    }

    getAvailableSurvivors(){
        return this._survivors.filter( s => s.isAvailable() );
    }

    createRandomSurvivor(name){
        const rng = this._randomNumberGenerator;
        const s = new Survivor();
        s.name(name);

        s.getMissionModifiers()
            .forEach( (x,y) => s.getMissionModifiers().setCell(x,y, rng.inBetween(0,2) ) );

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
                a
            );
        });
        builder.setRNG(this._randomNumberGenerator);
        builder.setLootDispatchers([this.getDefaultLootDispatcher()]);
        
        return builder;
    }

    getDefaultLootDispatcher(){
        const table1 = new LootTable();
        const table2 = new LootTable();
        const table3 = new LootTable();

        const dispatcher = new LootDispatcher(table1, table2, table3);
        return dispatcher;
    }

    addNewMission(mission){
        this._activeMissions.push(mission);
        mission.start();
    }

    endRound(){
        this._updateMissions();
    }
}

export const ENVIRONMENT = new GameEnvironment();


