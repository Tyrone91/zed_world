import { EquipmentTemplate } from "../generator/equipment-template.js";
import { getJSON, ResponseWrapper } from "../../util/ajax.js";



export class EquipmentLoader {

    constructor(templatepath = "/data/items/templates/") {
        this._path = templatepath;
    }

    /**
     * @returns {Promise<EquipmentTemplate>}
     */
    load(file, suffix = ".json") {
        return getJSON(`${this._path}/${file}${suffix}`)
            .then( raw => {
                const resp = new ResponseWrapper(raw);

                const name = resp.readText("name");
                const rarity = resp.readText("rarity"); //TODO: let me think about this. maybe an other table with weapon to rarity?
                const desc = resp.readText("description");
                const icon = resp.readText("icon");

                const lowerOptimalRangeMin = resp.readInt("lowerOptimalRangeMin");
                const lowerOptimalRangeMax = resp.readInt("lowerOptimalRangeMax");

                const upperOptimalRangeMin = resp.readInt("upperOptimalRangeMin");
                const upperOptimalRangeMax = resp.readInt("upperOptimalRangeMax");

                
                const lowerAccuracy = resp.readInt("lowerAccuary");
                const upperAccuracy = resp.readInt("upperAccuary");

                const lowerDamage = resp.readInt("lowerDamage");
                const upperDamage = resp.readInt("upperDamage");

                const lowerActionsPerRound = resp.readInt("lowerActionsPerRound");
                const upperActionsPerRound = resp.readInt("upperActionsPerRound");

                const lowerStability = resp.readInt("lowerStability");
                const upperStability = resp.readInt("upperStability");

                const res = new EquipmentTemplate(name, rarity, desc);

                res.accuracy.min = lowerAccuracy;
                res.accuracy.max = upperAccuracy;

                res.lowerOptimialRange.min = lowerOptimalRangeMin;
                res.lowerOptimialRange.max = lowerOptimalRangeMax;

                res.upperOptimalRange.min = upperOptimalRangeMin;
                res.upperOptimalRange.max = upperOptimalRangeMax;

                res.damage.min = lowerDamage;
                res.damage.max = upperDamage;

                res.actionsPerRound.min = lowerActionsPerRound;
                res.actionsPerRound.max = upperActionsPerRound;

                res.stability.min = lowerStability;
                res.stability.max = upperStability;

                resp.getMissing().forEach( key => console.warn(`Tried to read equipment ${file}. There was a missing key: ${key}`));

                return res;
            });
    }

    loadList(path) {
        return new Promise( (resolve, reject) => {
            getJSON(path)
                .then( resp => {
                    if(!Array.isArray(resp)) {
                        return [];
                    }

                    let idx = 0;
                    const res = [];

                    resp.forEach( entry => {
                        this.load(entry).then(template => {
                            ++idx;
                            res.push(template);
                            if(idx >= resp.length) {
                                resolve(res);
                            }
                        });
                    });

                    if(resp.length == 0) {
                        resolve(res);
                    }

                });
        });
    }
}