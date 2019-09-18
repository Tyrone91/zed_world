import { ViewComponent } from "../view-component.js";
import { SurvivorMission } from "../../mission/survivor-mission.js";
import { SurvivorListCompact } from "../survivor/survivor-list-compact.js";
import { ResourcePanel } from "../resource-panel.js";
import { BattleReportView } from "../battle-report-view.js";
import { LootCollector } from "../../loot-system-v3/loot-collector.js";
import { Resource, ResourceFood, ResourceWood, ResourceMetal } from "../../loot-system-v3/resources.js";

export class MissionHistory extends ViewComponent {

    /**
     * 
     * @param {SurvivorMission} mission 
     */
    constructor(mission){
        super();
        this.rootElement().addClass("mission-history");
        this._mission = mission;
        this._aliveSurvivorList = new SurvivorListCompact(mission.getFinalSurvivedMembers());
        this._fallenSurvivorList = new SurvivorListCompact(mission.getFinalFallenMembers());
        this.init();
    }

    _resourceEntry(name, value){
        return $("<div>").append( $("<span>").text(this.resolve(name)), $("<span>").text(value) );
    }

    _listEntry(title, list){
        return $("<div>").append( $("<span>").text(this.resolve(title)), list.domElement() );
    }

    init(){
        const root = this.rootElement();
        const m = this._mission;
        const teamNameLabel = $("<div>").append( $("<span>").text(this._mission.getTeams().map(t=>t.getName()).join(",")) );
        const collector = new LootCollector();
        collector.receive(...m.getFoundLoot().map(wrapper => wrapper.content).reduce( (prev,cur) => [...prev, ...cur],[]) );
        const res = collector.resources;
        const resources = [ 
            ["FOOD", Resource.combine(new ResourceFood(), ...res.food).amout ],
            ["WOOD", Resource.combine(new ResourceWood(), ...res.wood).amout],
            ["METAL", Resource.combine(new ResourceMetal(), ...res.metal).amout]
        ];
        const resourceElements = resources.map( arg => this._resourceEntry(...arg));

        const combatContainer = $("<div>");
        this._mission.getCombats().map( obj => new BattleReportView(obj.combat, obj.time).domElement()).forEach( e => combatContainer.append(e) );

        root.append(
            this._listEntry("FALLEN", this._fallenSurvivorList),
            this._listEntry("SURVIVED", this._aliveSurvivorList),
            ...resourceElements,
            combatContainer
        );

    }

    update(){

    }
}