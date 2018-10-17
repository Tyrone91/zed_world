import { ENVIRONMENT } from "./game-environment.js";
import { Survivor } from "./survivor.js";
import { MissionMap } from "../mission/mission-map.js";
import { Location } from "../mission/location.js";
import { MissionBuilder } from "../mission/mission-builder.js";
import { Team } from "../mission/team.js";

const game = ENVIRONMENT;

function testMission(){
    const builder = game.createDefaultMissionBuilder();

    const team = new Team("Test Team Mission Bois");
    team.addTeamMember( game.createRandomSurvivor("Random Team Member") );

    builder.setTeams([team]);
    builder.setTarget(game.getMissionMap().getPosition(0,0));
    
    return builder.build();
}

function setup(){
    game._survivors.push(
        new Survivor().name("Bob"),
        new Survivor().name("Francis"),
        new Survivor().name("Alex"),
        game.createRandomSurvivor("R1"),
        game.createRandomSurvivor("R2"),
        game.createRandomSurvivor("R3")
    );

    game._missionMap = new MissionMap(5,5, [
        {
            location: new Location("City", "A former glorous City, turned into an undead buffet."),
            x: 0,
            y: 0

        }
    ]);

    game.addNewMission(testMission());
}

setup();