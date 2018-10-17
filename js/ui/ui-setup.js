import { ContentManager } from "./content-manager.js";
import { MissionMap } from "../mission/mission-map.js";
import { ENVIRONMENT } from "../core/game-environment.js";
import { AugmentedTable } from "../math/augmented-table.js";
import { Location } from "../mission/location.js";
import { Team } from "../mission/team.js";
import { Survivor } from "../core/survivor.js";
import { MissionPlaner } from "./mission-planer.js";
import { CONTENT_MANAGER, DEFAULT_TEXT_RESOLVER } from "./view-component.js";
import { MissionSummary } from "./mission-summary.js";
import { LocationSelector } from "./location-selector.js";
import { TeamSelector } from "./team-selector.js";
import { MissionOverview } from "./mission-overview.js";
import { ActionButton } from "./action-button.js";
import { SurvivorListDetail } from "./survivor-list-detail.js";
import { ResourcePanel } from "./resource-panel.js";
import { AmmoPanel } from "./ammo-panel.js";
import { TeamCreator } from "./team-creator.js";

const game = ENVIRONMENT;
const manager = CONTENT_MANAGER;

function createMission(){
    const missionBuilder = game.createDefaultMissionBuilder();
    const locationSelector = new LocationSelector();
    const teamSelector = new TeamSelector();
    
    

    locationSelector.onLocationSelection( loc => {
        missionBuilder.setTarget(loc);
        manager.pushContent( () => teamSelector.domElement() );
    });

    teamSelector.onTeamSelected( team => {
        missionBuilder.setTeams([team]);

        const mission = missionBuilder.build();
        const missionSummary = new MissionSummary(mission);
        missionSummary.onconfirmation( () => {
            game.addNewMission(mission);
            openMissionOverview();
        });
        manager.pushContent( () => missionSummary.domElement() );
    });

    manager.setContent( () => locationSelector.domElement());
}

function openSurvivorOverview(){
    const list = new SurvivorListDetail(game.getAvailableSurvivors());

    manager.setContent( () => list.domElement());
}

function openMissionOverview(){
    const missionOverview = new MissionOverview();

    missionOverview.onNewMission( () => createMission());

    missionOverview.onMissionSelection( m => {
        const summary = new MissionSummary(m);
        summary.onconfirmation( () => manager.popContent() );
        manager.pushContent( () => summary.domElement());
    });

    missionOverview.onCreateNewTeam( () => {
        const creator = new TeamCreator();
        creator.onNewTeam( team => {
            //TODO: add to game.
            openMissionOverview();
        });

        manager.pushContent( () => creator.domElement());
    });

    manager.setContent( () => missionOverview.domElement());
    
}

function initResourceBar(){
    const camp = game.getCamp();
    const woodView = new ResourcePanel(camp.getWoodStock());
    const metalView = new ResourcePanel(camp.getMetalStock());
    const foodView = new ResourcePanel(camp.getFoodStock());

    const ammoView = new AmmoPanel(camp.getAmmoStock());

    $("#resource-view").append(
        ammoView.domElement(),
        foodView.domElement(),
        woodView.domElement(),
        metalView.domElement());
}

DEFAULT_TEXT_RESOLVER.load("en.json")
.then( () => {
    $(document).ready(init);
});
function init(){
    initResourceBar();
    manager.addMenuEntry("Survivors", () => openSurvivorOverview() );
    manager.addMenuEntry("Mission", () => openMissionOverview() );

    $("#side-panel").append( new ActionButton("End Round").onclick( () => game.endRound()).domElement() );
}









