import {SurvivorMission} from "../../js/mission/survivor-mission.js"
import {MissionBuilder} from "../../js/mission/mission-builder.js"

describe("Mission System Trst", function(){
    describe("mission builder test", () => {

            it("mission is not ready if not all parameters are set", function(){
                const builder = new MissionBuilder();

                expect(builder.isReady()).toBeFalsy();

                builder.setLootDispatcher({});
                expect(builder.isReady()).toBeFalsy();

                builder.setMissionLength(3);
                expect(builder.isReady()).toBeFalsy();

                builder.setTarget({});
                expect(builder.isReady()).toBeFalsy();

                builder.setTeams([{}]);
                expect(builder.isReady()).toBeTruthy();
            });
            
        });
});


