import { SurvivorMission } from "../../js/mission/survivor-mission.js"
import { MissionBuilder } from "../../js/mission/mission-builder.js"
import { LootDispatcher } from "../../js/mission/loot-dispatcher.js";
import { Random } from "../../js/math/random.js";
import { Location } from "../../js/mission/location.js";
import { Team } from "../../js/mission/team.js";
import { Survivor } from "../../js/core/survivor.js";
import { LootTable } from "../../js/loot-system/loot-table.js";
import { LootContainer } from "../../js/loot-system/loot-container.js";
import { GameConstants } from "../../js/core/game-constants.js";
import { AmmoTable } from "../../js/loot-system/ammo-table.js";

describe("Mission System Test", function () {

    function getFakeRNG(...values) {
        let index = 0;
        function getValue() {
            const res = values[index];
            index = (index + 1) % values.length;
            return res;
        }
        return {
            inBetween(low, upper) {
                const f = this.nextInt() / Number.MAX_SAFE_INTEGER;
                return Math.floor(low + ((upper - low) * f));
            },

            nextInt() {
                return getValue();
            },

            next() {
                return getValue() / Number.MAX_SAFE_INTEGER;
            }
        }
    }

    function lootTableOfEqual(...items) {
        const res = new LootTable();
        items.forEach(item => res.add(item, 10));
        return res;
    }

    describe("mission util-functions test", function () {

        describe("team death/alive", function () {
            let team = new Team();

            let s1 = new Survivor();
            let s2 = new Survivor();
            let s3 = new Survivor();
            let s4 = new Survivor();
            team.addTeamMember(s1, s2, s3, s4);

            function set(v1, v2, v3, v4) {
                s1.stats.health.current(v1);
                s2.stats.health.current(v2);
                s3.stats.health.current(v3);
                s4.stats.health.current(v4);
            }
            beforeEach(function () {
                team = new Team();
                s1 = new Survivor();
                s2 = new Survivor();
                s3 = new Survivor();
                s4 = new Survivor();
                team.addTeamMember(s1, s2, s3, s4);
            });

            it("some live, some die, in the way of the samurai", function () {
                //some live again. necromancy confirmed.
                set(100, 0, 100, 0);
                expect(team.getTeam()).toEqual([s1, s2, s3, s4]);
                expect(team.getLivingMembers()).toEqual([s1, s3]);
                expect(team.getFallenMembers()).toEqual([s2, s4]);
            });

            it("team alive test", function () {
                //be sure they are alive (yet)
                set(100, 100, 100, 100);
                expect(team.getTeam()).toEqual([s1, s2, s3, s4]);
                expect(team.getLivingMembers()).toEqual([s1, s2, s3, s4]);
                expect(team.getFallenMembers()).toEqual([]);
            });

            it("team dead test", function () {
                //be sure they are dead
                set(0, 0, 0, 0);
                expect(team.getTeam()).toEqual([s1, s2, s3, s4]);
                expect(team.getLivingMembers()).toEqual([]);
                expect(team.getFallenMembers()).toEqual([s1, s2, s3, s4]);
            });
        });



        it("getLivingMembers test", function () {
            const builder = new MissionBuilder();

            const dispatcher = [{ disptacher: "test" }];
            const missionLenght = 69;
            const target = { targetLocation: "17" };
            const rng = { random: 87 };

            builder.setLootDispatchers(dispatcher);
            builder.setMissionLength(missionLenght);
            builder.setTarget(target);

            builder.setRNG(rng);

            const team1 = new Team();
            const team2 = new Team();

            const s1 = new Survivor();
            const s2 = new Survivor();
            const s3 = new Survivor();
            const s4 = new Survivor();

            //be sure they are dead
            s1.stats.health.current(0);
            s2.stats.health.current(0);
            s3.stats.health.current(0);
            s4.stats.health.current(0);

            team1.addTeamMember(s1, s2);
            team2.addTeamMember(s3, s4);

            builder.setTeams([team1, team2]);

            const mission = builder.build();

            expect(mission.getSurivivors()).toEqual([]);
        });
    });

    describe("mission builder test", () => {

        it("mission is not ready if not all parameters are set", function () {
            const builder = new MissionBuilder();

            expect(builder.isReady()).toBeFalsy();

            builder.setLootDispatchers({});
            expect(builder.isReady()).toBeFalsy();

            builder.setMissionLength(3);
            expect(builder.isReady()).toBeFalsy();

            builder.setTarget({});
            expect(builder.isReady()).toBeFalsy();

            builder.setRNG({});
            expect(builder.isReady()).toBeFalsy();

            builder.setTeams([{}]);
            expect(builder.isReady()).toBeTruthy();

        });

        it("can create a mission object", function () {
            const builder = new MissionBuilder();

            const dispatcher = [{ disptacher: "test" }];
            const missionLenght = 69;
            const target = { targetLocation: "17" };
            const teams = [{ someteams: "juhu" }];
            const rng = { random: 87 };

            builder.setLootDispatchers(dispatcher);
            builder.setMissionLength(missionLenght);
            builder.setTarget(target);
            builder.setTeams(teams);
            builder.setRNG(rng);

            const mission = builder.build();

            expect(mission._lootDispatchers).toEqual(dispatcher);
            expect(mission._missionLength).toEqual(missionLenght);
            expect(mission._targetLocation).toEqual(target);
            expect(mission._team).toEqual(teams);
            expect(mission._rng).toEqual(rng);
        });

    });

    describe("mission execution test", function () {

        function createLootTable(){
            const res = new LootTable();
            const ammo = new AmmoTable();
            ammo.getAllRows().forEach(row => row.amount(1000) );
            const c1 = new LootContainer(GameConstants.Loot.Type.AMMO, () => ammo );
            const c2 = new LootContainer(GameConstants.Loot.Type.EQUIPMENT, () => "Equipment");
            const c3 = new LootContainer(GameConstants.Loot.Type.FOOD, () => 1000);
            res.add(c1,10);
            res.add(c2,10);
            res.add(c3,10);
            return res;
        }

        let survivor1 = new Survivor();
        let survivor2 = new Survivor();
        let survivor3 = new Survivor();
        let survivors = [survivor1, survivor2, survivor3];
        let defaultLocation = new Location();
        let missionBuilder = new MissionBuilder();
        let defaultLootDispatcher = new LootDispatcher();
        let commonTable = createLootTable(), rareTable = createLootTable(), extraOrdinaryTable = createLootTable();

        beforeEach(function () {
            const giveHp = function (surv, value = 100) {
                surv.stats.health.current(value);
                return surv;
            };
            survivor1 = giveHp(new Survivor());
            survivor2 = giveHp(new Survivor());
            survivor3 = giveHp(new Survivor());
            survivors = [survivor1, survivor2, survivor3];
            defaultLocation = new Location("DEFAULT", "FOR_TESTING");
            missionBuilder = new MissionBuilder();
            commonTable = createLootTable();
            rareTable = createLootTable();
            extraOrdinaryTable = createLootTable();
            defaultLootDispatcher = new LootDispatcher(extraOrdinaryTable, rareTable, commonTable);
        });

        function getTeam() {
            const res = new Team("TestTeam")
            res.addTeamMember(survivor1, survivor2, survivor3);
            return res;
        }

        it("mission timeleft test", function () {
            const rng = getFakeRNG(0);
            const lootTable = lootTableOfEqual("TEST01", "TEST02");
            const dispatcher = new LootDispatcher(lootTable, lootTable, lootTable);
            const location = new Location();
            const team = getTeam();

            const builder = new MissionBuilder();
            builder.setTarget(location);
            builder.setMissionLength(5);
            builder.setTeams([team]);
            builder.setLootDispatchers([dispatcher]);
            builder.setRNG(rng);

            const mission = builder.build();

            expect(mission.timeLeft()).toEqual(5);

            mission.passTime();
            expect(mission.timeLeft()).toEqual(4);

            mission.passTime();
            expect(mission.timeLeft()).toEqual(3);

            mission.passTime();
            expect(mission.timeLeft()).toEqual(2);

            mission.passTime();
            expect(mission.timeLeft()).toEqual(1);

            mission.passTime();
            expect(mission.timeLeft()).toEqual(0);
        });

        describe("mission over test", function () {
            function quickBuild() {
                const rng = getFakeRNG(0);
                const lootTable = lootTableOfEqual("TEST01", "TEST02");
                const dispatcher = new LootDispatcher(lootTable, lootTable, lootTable);
                const location = new Location();
                const team = getTeam();

                const builder = new MissionBuilder();
                builder.setTarget(location);
                builder.setMissionLength(3);
                builder.setTeams([team]);
                builder.setLootDispatchers([dispatcher]);
                builder.setRNG(rng);
                return builder.build()
            };

            it("over by time", function () {

                const mission = quickBuild();

                expect(mission.isFinished()).toBeFalsy();

                mission.passTime();
                mission.passTime();
                mission.passTime();

                expect(mission.isFinished()).toBeTruthy();

            });

            it("over by dead", function () {
                const mission = quickBuild();
                const deadTeam = new Team();
                deadTeam.addTeamMember(survivor1);
                survivor1.stats.health.current(0);
                mission._team = [deadTeam];
                expect(mission.timeLeft()).toBeGreaterThan(0);
                expect(mission.isFinished()).toBeTruthy();
            });

            it("over by retreat", function () {
                const mission = quickBuild();
                const retreatTeam = getTeam();
                retreatTeam._continueAfterCombat = false;
                mission._team = [retreatTeam];
                mission.getBaseValues().encounterChance.min(100).max(100);

                expect(mission.timeLeft()).toBeGreaterThan(0);
                expect(mission.isFinished()).toBeFalsy();

                mission.passTime();

                expect(mission.getSurivivors()).toEqual([survivor1, survivor2, survivor3]);
                expect(mission.timeLeft()).toBeGreaterThan(0);
                expect(mission.isFinished()).toBeTruthy();
            });
        });

        describe("restock phase", function () {

            function setHungerForAllTo(value, max = 50) {
                survivor1.stats.hunger.current(value).max(max);
                survivor2.stats.hunger.current(value).max(max);
                survivor3.stats.hunger.current(value).max(max);
            }

            beforeEach(function () {
                setHungerForAllTo(0, 50);
            });

            it("no consume because no hunger", function () {
                const team = new Team();
                team.addTeamMember(survivor1, survivor2, survivor3);
                setHungerForAllTo(50, 50);
                team.setFoodStock(400);

                expect(team.getFoodStock()).toEqual(400, "started with correct food");

                missionBuilder.setLootDispatchers([defaultLootDispatcher]);
                missionBuilder.setMissionLength(10);
                missionBuilder.setRNG(getFakeRNG(0));
                missionBuilder.setTarget(defaultLocation);
                missionBuilder.setTeams([team]);

                const mission = missionBuilder.build();
                mission.passTime();
                mission.passTime();
                mission.passTime();
                
                expect(team.getFoodStock()).toEqual(400, "not enough food carried");
                expect(survivor1.stats.hunger.current()).toEqual(survivor1.stats.hunger.max());
                expect(survivor2.stats.hunger.current()).toEqual(survivor2.stats.hunger.max());
                expect(survivor3.stats.hunger.current()).toEqual(survivor3.stats.hunger.max());
            });

            it("consume because hunger", function () {
                const team = new Team();
                team.addTeamMember(survivor1, survivor2, survivor3);
                setHungerForAllTo(40, 50);
                team.setFoodStock(400);

                expect(team.getFoodStock()).toEqual(400);

                missionBuilder.setLootDispatchers([defaultLootDispatcher]);
                missionBuilder.setMissionLength(10);
                missionBuilder.setRNG(getFakeRNG(0));
                missionBuilder.setTarget(defaultLocation);
                missionBuilder.setTeams([team]);

                const mission = missionBuilder.build();
                
                mission.passTime();
                mission.passTime();
                mission.passTime();

                expect(team.getFoodStock()).toEqual(400 - (3 * 10) );
                expect(survivor1.stats.hunger.current()).toEqual(survivor1.stats.hunger.max());
                expect(survivor2.stats.hunger.current()).toEqual(survivor2.stats.hunger.max());
                expect(survivor3.stats.hunger.current()).toEqual(survivor3.stats.hunger.max());
            });

        });

    });
});


