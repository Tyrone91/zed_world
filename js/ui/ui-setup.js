import { ContentManager } from "./content-manager.js";
import { MissionMap } from "../mission/mission-map.js";
import { ENVIRONMENT } from "../core/game-environment.js";
import { AugmentedTable } from "../math/augmented-table.js";
import { Location } from "../mission/location.js";
import { Team } from "../mission/team.js";
import { Survivor } from "../core/survivor.js";
import { MissionPlaner } from "./mission-planer.js";
import { CONTENT_MANAGER } from "./view-component.js";
import { MissionSummary } from "./mission-summary.js";
import { LocationSelector } from "./location-selector.js";
import { TeamSelector } from "./team-selector.js";

const game = ENVIRONMENT;
const manager = CONTENT_MANAGER;

function createMission(){
    const missionBuilder = game.createDefaultMissionBuilder();
    const locationSelector = new LocationSelector();
    const teamSelector = new TeamSelector();
    const missionSummary = new MissionSummary();
    

    locationSelector.onLocationSelection( loc => {
        missionBuilder.setTarget(loc);
        manager.pushContent( () => teamSelector.domElement() );
    });

    teamSelector.onTeamSelected( team => {
        missionBuilder.setTeams([team]);
        manager.pushContent( () => missionSummary.domElement() );
    });

    missionSummary.onconfirmation( () => {
        const m = missionBuilder.build();
        game.addNewMission(m);
    });

    manager.setContent( () => locationSelector.domElement());
}

window.addEventListener("load", init);
function init(){
    CONTENT_MANAGER
        .addMenuEntry("Mission", () => createMission() );
}

















