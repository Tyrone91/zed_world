import { ViewComponent } from "./view-component.js";
import { AugmentedTable } from "../math/augmented-table.js";


export class StatsViewer extends ViewComponent {

    /**
     * 
     * @param {AugmentedTable} source 
     * @param {string[]} whitelist 
     */
    constructor(source, whitelist = []){
        super();
        this.rootElement().addClass("stat-viewer");
        this._souce = source;
    }

    setStats(stats){
        this._souce = stats;
    }

    update(){
        this.clear();
        const root = this.rootElement();
        const table = this._souce;
        root.append(
            table.getColumnNames()
            .map( name => $("<div>").text( this.resolve(name)) )
            .reduce( (prev, current) => prev.append(current), $("<div>").append($("<div>").text("names") ) )
        );

        table.getRowNames()
        .forEach(rowName => {
            const row = $("<div>");
            row.append(
                $("<div>").text( this.resolve(rowName))
            );
            const colums = table.getRow(rowName);
            table.getColumnNames().forEach( name => {
                /**@type {number} */
                const value = colums.accessColumn(name);
                
                row.append(
                    $("<div>")
                        .append( $("<div>").text( Number.parseFloat(value.toFixed(2)) ))
                );
            });
            root.append(row);
        });
    }
}