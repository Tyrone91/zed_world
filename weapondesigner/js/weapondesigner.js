import { Equipment } from "../../js/equipment/equipment.js";
import { WeaponStatsDrawer } from "./weapon-stats-drawer.js";
import { CombatStats } from "../../js/combat/combat-stats.js";
import { AugmentedTableColumnAccessHelper } from "../../js/math/augmented-table.js"

/**
 * 
 * @param {AugmentedTableColumnAccessHelper} entry
 */
function htmlStatsEntry(entry){
    const res = $("<div>").addClass("stats-entry");

    const nameLabel = $("<span>").text(entry.name);
    const inputMin = $("<input>").val(entry.min()).on("input", (event) => {
        const value = Number.parseInt($(event.currentTarget).val() );
        if(isNaN(value)){
            return;
        }
        
        entry.min(value);
        entry.base( (entry.max() + entry.min())/2 );

        inputBase.val(entry.base());
    });
    const inputBase = $("<input>").val(entry.base()).on("input", (event) => {
        const value = Number.parseInt($(event.currentTarget).val() );
        if(isNaN(value)){
            return;
        }
        entry.base( Number.parseInt(value));
    });
    const inputMax = $("<input>").val(entry.max()).on("input", (event) => {
        const value = Number.parseInt($(event.currentTarget).val() );
        if(isNaN(value)){
            return;
        }
        entry.max( value);
        entry.base( (entry.max() + entry.min())/2 );
        inputBase.val(entry.base());
    });

    return res.append(nameLabel,inputMin, inputBase, inputMax);
}

/**
 * 
 * @param {CombatStats} stats 
 */
function htmlStats(stats){
    const res = $("<div>");
    res.append(
        $("<div>").addClass("stats-heading").append(
            $("<span>").text(""),
            $("<span>").text("Min."),
            $("<span>").text("Base"), 
            $("<span>").text("Max.")
        )
    );
    stats.getAllRows()
    .forEach( row => {
        const e = htmlStatsEntry(row);
        res.append(e);
    });
    return res;
}

/**
 * 
 * @param {WeaponDesigner} designer 
 */
function htmlControls(designer){
    const bttnNewWeapon = $("<button>").on("click", event => {
        designer.newWeapon();
    }).text("New Weapon");

    const bttnNewTemplate = $("<button>").on("click", event => {
        designer.newTemplate();
    }).text("New Template");

    const bttnLoadWeapon = $("<button>").on("click", event => {
        designer.loadWeapon();
    }).text("Load Weapon");

    const bttnLoadTemplate = $("<button>").on("click", event => {
        designer.loadTemplate();
    }).text("Load Template");

    return $("<div>")
        .append(bttnNewWeapon, bttnLoadWeapon, bttnNewTemplate, bttnLoadTemplate)
        .addClass("controls");
}

/**
 * 
 * @param {WeaponDesigner} designer 
 */
function htmlMiscEditor(designer){
    const equipment = designer._currentWeapon;
    const inputName = $("<input>").on("input", event => {

    }).val(equipment.name);

    const inputDesc = $("<input>").on("input", event => {

    }).val(equipment.description);

    return $("<div>").append(
        $("<div>").append( $("<span>").text("Name"), inputName ),
        $("<div>").append( $("<span>").text("Desc"), inputDesc )
    );
}

/**
 * 
 * @param {WeaponDesigner} designer 
 */
function htmlDesigner(designer){
    const canvas = designer._graph.domElement;
    const canvasContainer = $("<div>").append(canvas).addClass("canvas-container");
    $(window).on("resize", () => {
        canvas.width = canvasContainer.innerWidth();
        canvas.height = canvasContainer.innerHeight();
        designer.drawGraph();
    });
    
    const sidePanel = $("<div>").addClass("side-panel");
    sidePanel.append(
        htmlControls(designer),
        htmlMiscEditor(designer),
        htmlStats(designer._currentWeapon.stats) 
    );
    sidePanel.find("input").on("input", () => designer.drawGraph() );
    return $("<div>").append(canvasContainer, sidePanel).addClass("weapon-designer");

}

export class WeaponDesigner {
    constructor(){
        const canvas = document.createElement("canvas");
        this._graph = new WeaponStatsDrawer(canvas, 100, 0);
        this._graph.setPadding(30,30);
        this._graph.setMarkerSteps(10);
        this._currentWeapon = new Equipment("DEFAULT", "DEFAULT", "DEFAULT");
        this._currentWeapon.stats.fill(10);
    }

    drawGraph(){
        const e = this._currentWeapon;
        this._graph.draw(e);
    }

    newWeapon(){

    }

    newTemplate(){

    }

    loadWeapon(){

    }

    loadTemplate(){

    }

    exportWeapon(){

    }

    exportTemplate(){

    }

    get domElement(){
        this.drawGraph();
        return htmlDesigner(this);
    }



}



function createDummy(name, acc, stab, min, max){
    const e = new Equipment();
    e._name = name;
    e.stats.accuracy.base(acc);
    e.stats.stability.base(stab);
    e.stats.optimalRange.min(min).max(max);
    return e;
}

export function test(canvas){
    
    const list = [
        createDummy("Average Rifle", 50, 20, 20, 55),
        createDummy("Good Rifle" ,50, 80, 20, 55),
        createDummy("Sniper B" ,75, 50, 50, 75),
        createDummy("Sniper A" ,75, 95, 60, 60)
    ];
    
    /*
    const list = [
        //createDummy("Weapon A", 65, 55, 15, 50),
        //createDummy("Weapon B" ,60, 75, 25, 60),

        createDummy("Close", 80, 80, 20, 20),
        createDummy("Mid", 80, 80, 40, 40)
    ];
    */

    const drawer = new WeaponStatsDrawer(canvas, 100, 0);
    drawer.draw(...list);

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawer.draw(...list);
    });

    $("#checkbox-show-avg").on("change",function(event){
        drawer.setShowAverage($(this).prop("checked") );
        drawer.draw(...list);
    });

    $("#slider-distance").on("input",function(event){
        
        drawer.setFocusedArea(Number.parseInt( $(this).val() ));
        drawer.draw(...list);
    });

    $("#slider-padding-start").on("input",function(event){
        drawer.setPaddingStart(Number.parseInt( $(this).val() ));
        drawer.draw(...list);
    });

    $("#slider-padding-end").on("input",function(event){
        drawer.setPaddingEnd(Number.parseInt( $(this).val() ));
        drawer.draw(...list);
    });

    $("#slider-marker-steps").on("input",function(event){
        
        drawer.setMarkerSteps(Number.parseInt( $(this).val() ));
        drawer.draw(...list);
    });

    $("#slider-font-size").on("input",function(event){
        
        drawer.setFontSize(Number.parseInt( $(this).val() ));
        drawer.draw(...list);
    });

    const equip = new Equipment("name", "ffdg", "fgdfg", "fgdfg");
    
}

window.addEventListener("load", () => {
    const d = new WeaponDesigner();
    $(document.body).append(d.domElement);
});
window.testDraw = test;


