import { ContentManager } from "./content-manager.js";
import { MissionMap } from "../mission/mission-map.js";
import { ENVIRONMENT } from "../core/game-environment.js";
import { AugmentedTable } from "../math/augmented-table.js";
import { Location } from "../mission/location.js";
import { Team } from "../mission/team.js";
import { Survivor } from "../core/character/survivor.js";
import { MissionPlaner } from "./mission/mission-planer.js";
import { CONTENT_MANAGER, DEFAULT_TEXT_RESOLVER } from "./view-component.js";
import { MissionSummary } from "./mission/mission-summary.js";
import { LocationSelector } from "./location-selector.js";
import { TeamSelector } from "./team/team-selector.js";
import { MissionOverview } from "./mission/mission-overview.js";
import { ActionButton } from "./action-button.js";
import { SurvivorListDetail } from "./survivor/survivor-list-detail.js";
import { ResourcePanel } from "./resource-panel.js";
import { AmmoPanel } from "./ammo-panel.js";
import { TeamCreator } from "./team/team-creator.js";
import { MissionList } from "./mission/mission-list.js";
import { TeamViewer } from "./team/team-viewer.js";
import { MissionHistory } from "./mission/mission-history.js";
import { getJSON } from "../util/ajax.js";
import { SurvivorQuickList } from "./survivor/survivor-quick-list.js";
import { ArmoryView } from "./equipment/armory-view.js";

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

function openArmoryView() {
    const camp = game.getCamp();
    const armory = camp.getArmory();
    const view = new ArmoryView(armory);
    view.onclick( e => {
        console.log(`Stats of ${e.name}:`, e.stats.toString(), e);
    })
    manager.setContent( () => view.domElement() );
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
            game.saveTeam(team);
            openMissionOverview();
        });

        manager.pushContent( () => creator.domElement());
    });

    missionOverview.onMissionHistory( () => {
        const list = new MissionList(game.getMissionHistory());
        list.onclick( mission => {
            const history = new MissionHistory(mission);
            manager.pushContent( () => history.domElement());
        });
        manager.pushContent( () => list.domElement() );
    });

    missionOverview.onViewTeams( () => {
        const element = game.getSavedTeams().map( t => new TeamViewer(t).domElement()).reduce( (prev, cur) => prev.append(cur), $("<div>"));
        manager.pushContent( () => element);
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
    
        return () => {
            ammoView.update();
            foodView.update();
            woodView.update();
            metalView.update();
        }
}

function initQuickList() {
    const list = new SurvivorQuickList(game);
    return list;
}

DEFAULT_TEXT_RESOLVER.load("en.json") //TODO: has nothing todo with the UI remove.
.then( () => {
    return getJSON("/data/random_portraits.json");
})
.then( data => {
    game.characterCreator.portraitsList = data;
    $(document).ready(init);
});
function init(){
    const resourceUpdater = initResourceBar();
    const quickList = initQuickList();
    
    manager.addMenuEntry("Armory", () => openArmoryView() );
    manager.addMenuEntry("Survivors", () => openSurvivorOverview() );
    manager.addMenuEntry("Mission", () => openMissionOverview() );

    $("#side-panel")
        .append(quickList.domElement())
        .append( new ActionButton("End Round").onclick( () => game.endRound()).domElement() );
    game.onroundEnd(g => {
        manager.update();
        resourceUpdater();
        quickList.update();
    });

    game.onsurvivorStateChange( s => {
        quickList.update();
    });

    game.onsurvivorAdded( () => {
        quickList.update();
    });
    game.start();
}









