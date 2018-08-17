import { Combat } from "../../js/combat/combat.js"
import { Survivor } from "../../js/core/survivor.js";
import { CombatStats } from "../../js/combat/combat-stats.js";
import { Zombie } from "../../js/combat/zombie.js";
import { Round } from "../../js/combat/round.js";

describe("Combat Testing", function(){

    function fakeRNG(...values){
        let cnt = 0;
        const inc = () => {let tmp = cnt++; cnt = cnt % values.length; return tmp};
        return {
            nextInt: function(){
                return values[inc()];
            },

            next: function(){
                return values[inc()];
            },

            inBetween: function(min, max){
                const f = this.nextInt() / Number.MAX_SAFE_INTEGER;
                return Math.floor(min + ( (max-min) * f ));
            }
        };
    }

    it("Creation Test", function() {

        const pivot = new Combat(fakeRNG([0]), 100, 3.5 );
        
        expect(pivot._distanceToSurvivors).toBe(100);
        expect(pivot._distanceCoveragePerRound).toBe(3.5);
        expect(pivot._roundNr).toBe(1);
    });

    describe("Implementation Test", function(){
        function defaultObject(){
            return new Combat(fakeRNG([0]), 100, 15 );
        };

        function survivors(times =1 ,stats = new CombatStats().fill(5) ){
            /**
             * @param {Survivor} surv 
             */
            const applyStats = (surv) => {
              surv._combatstats.fill(0).add(stats); //copy values hack
            };
            const res = [];
            for(let i = 0; i < times; ++i){
                res.push( new Survivor());
                res[i].name("Surv" + i);
            }
            res.forEach(applyStats);
            return res;
        };

        function zombies(times=1){
            const res = [];
            for(let i = 0; i < times; ++i){
                res.push( new Zombie() );
            }
            return res;
        }

        describe("Combatants init. Active Combatants: ", function(){

            it("with 1" , function(){
                const combat = defaultObject();
                combat.addSurvivor(...survivors(1));
                combat.addEnemy(...zombies(1));

                expect(combat.combatIsOver() ).toBeFalsy();
                expect(combat._roundNr).toBe(1);
                expect(combat._enemies.length).toEqual(1);
                expect(combat._surivors.length).toEqual(1);
            });

            it("with 10" , function(){
                const combat = defaultObject();
                combat.addSurvivor(...survivors(10));
                combat.addEnemy(...zombies(10));

                expect(combat.combatIsOver() ).toBeFalsy();
                expect(combat._roundNr).toBe(1);
                expect(combat._enemies.length).toEqual(10);
                expect(combat._surivors.length).toEqual(10);
            });

            it("with 0" , function(){
                const combat = defaultObject();
                combat.addSurvivor(...survivors(0));
                combat.addEnemy(...zombies(0));

                expect(combat.combatIsOver() ).toBeTruthy();
                expect(combat._roundNr).toBe(1);
                expect(combat._enemies.length).toEqual(0);
                expect(combat._surivors.length).toEqual(0);
            });
            
        });

        it("round inc test", function() {
            const combat = defaultObject();
            combat.addSurvivor(...survivors(1));
            combat.addEnemy(...zombies(1));

            expect(combat.combatIsOver() ).toBeFalsy();
            expect(combat._roundNr).toBe(1);


            combat.processRound();

            expect(combat._roundNr).toBe(2);
        });

        it("test zombie attack in range", function(){
            const combat = defaultObject();
            const stats = new CombatStats().fill(0);
            combat.addSurvivor(...survivors(1, stats));
            combat.addEnemy(...zombies(1));
            combat._distanceToSurvivors = 0;

            expect(combat.combatIsOver()).toBeFalsy();
            combat._currentRound = new Round(1, combat._surivors, combat._enemies,0);

            combat.processRound();

            const report = combat._rounds[0];

            expect(report).toBeDefined();
            expect(report.distance).toBe(0);
            
            const actions = report.getActions();
            expect(actions.length).toBe(1, "The lenght should be 2 because the survivor acts first and can't be killed yet. But in this scenario I set the actions points to zero.");

            
        });

        it("test zombie attack not in range", function(){
            const combat = defaultObject();
            const stats = new CombatStats().fill(0);
            combat.addSurvivor(...survivors(1, stats));
            combat.addEnemy(...zombies(1));
            combat._distanceToSurvivors = 10;

            expect(combat.combatIsOver()).toBeFalsy();
            combat._currentRound = new Round(1, combat._surivors, combat._enemies,10);

            combat.processRound();

            const report = combat._rounds[0];

            expect(report).toBeDefined();
            expect(report.distance).toBe(10);
            
            const actions = report.getActions();
            expect(actions.length).toBe(0, "The Survivor hat zero actions points and the zombie is not in range, Therefore 0 actions");

            
        });

    });
});