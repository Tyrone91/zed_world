import { Equipment } from "../../js/equipment/equipment.js";

describe("Equipment test", function(){
    describe("Calculations", function(){

        describe("accuracy", function(){
            it("no penaltiy because of in range", function(){
                const equipment = new Equipment();
                equipment.stats.optimalRange.max(75).min(25);
                equipment.stats.accuracy.base(50);
                equipment.stats.stability.base(50);
                
                expect(equipment.accuracyAtDistance(60)).toBe(50, "Accuracy was modified falsy");
            });

            it("no penaltiy because of stability", function(){
                const equipment = new Equipment();
                equipment.stats.optimalRange.max(50).min(50);
                equipment.stats.accuracy.base(50);
                equipment.stats.stability.base(100);
                
                expect(equipment.accuracyAtDistance(60)).toBe(50, "Accuracy was modified falsy");
            });

            it("penaltiy because out of range and no 100 stability", function(){
                const equipment = new Equipment();
                equipment.stats.optimalRange.max(50).min(50);
                equipment.stats.accuracy.base(50);
                equipment.stats.stability.base(80);
                
                expect(equipment.accuracyAtDistance(60)).toBeLessThan(50, "Accuracy was modified falsy");
            });

            it("penaltiy lower with high stability", function(){
                const equipment = new Equipment();
                equipment.stats.optimalRange.max(50).min(50);
                equipment.stats.accuracy.base(50);
                equipment.stats.stability.base(80);
                
                const valueHigherStability = equipment.accuracyAtDistance(60);

                equipment.stats.stability.base(70);

                const valueLowerStability = equipment.accuracyAtDistance(60);

                expect(valueHigherStability).toBeGreaterThan(valueLowerStability, "More Stability should lower the penalty");
            });
        });

    });
});