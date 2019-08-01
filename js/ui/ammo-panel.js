import { ViewComponent } from "./view-component.js";
import { AmmoTable } from "../loot-system-v3/ammo-table.js";

export class AmmoPanel extends ViewComponent {
    
    /**
     * 
     * @param {AmmoTable} ammo 
     */
    constructor(ammo){
        super();
        this.rootElement().addClass("ammo-panel");
        this._ammo = ammo;
    }


    update(){
        const root = this.rootElement();
        root.empty();
        const ammo = this._ammo;

        root.append( $("<span>").text(this.resolve("AMMO")) );
        ammo.getAllRows().map( a => {
            const name = a.name;
            const value = /**@type {number} */ (a.amount());
            return $("<span>").append($("<span>").text( this.resolve(name) ), $("<span>").text(value) );
        })
        .forEach( e => root.append(e));
    }
}