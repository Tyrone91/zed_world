import {SurvivorMission} from "../../js/mission/survivor-mission"


describe("Mission function test", () => {

    it("Initialization test", () => {
        const mission = new SurvivorMission();
    });

    it("Calculation test", () => {
        const mission = new SurvivorMission();
        mission.calcMissionValues();
    });
});