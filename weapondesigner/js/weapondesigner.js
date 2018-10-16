import { Equipment } from "../../js/equipment/equipment.js";
import { WeaponStatsDrawer } from "./weapon-stats-drawer.js";



function createDummy(name, acc, stab, min, max){
    const e = new Equipment();
    e._name = name;
    e.stats.accuracy.base(acc);
    e.stats.stability.base(stab);
    e.stats.optimalRange.min(min).max(max);
    return e;
}

export function test(canvas){
    /*
    const list = [
        createDummy("Average Rifle", 50, 20, 20, 55),
        createDummy("Good Rifle" ,50, 80, 20, 55),
        createDummy("Sniper B" ,75, 50, 50, 75),
        createDummy("Sniper A" ,75, 95, 60, 60)
    ];
    */

    const list = [
        //createDummy("Weapon A", 65, 55, 15, 50),
        //createDummy("Weapon B" ,60, 75, 25, 60),

        createDummy("Close", 80, 80, 20, 20),
        createDummy("Mid", 80, 80, 40, 40)
    ];

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
}
window.testDraw = test;


