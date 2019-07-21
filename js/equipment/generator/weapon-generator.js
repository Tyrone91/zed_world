import { Equipable } from "../equipable.js";
import { EquipmentTemplate } from "./equipment-template.js";
import { Random } from "../../math/random.js";
import { Range } from "../../util/range.js";
import { CombatStats } from "../../combat/combat-stats.js";

export class WeaponGenerator {

    /**
     * 
     * @param {Random} rng 
     */
    constructor(rng) {
        this._rng = rng;
    }

    _scaleUp(value, scale) {
        return value * (1 + (scale/10) ); //TODO: relace placeholder scaleup function with something smarter.
    }

    /**
     * 
     * @param {Range} range 
     * @param {number} scale 
     */
    _rollSingle(range, scale = 1) {
        const val = this._rng.inBetween(range.min, range.max+1);
        return this._scaleUp(val, scale);
    }

    /**
     * 
     * @param {CombatStats.Accesscor} accesscor 
     * @param {*} range 
     */
    _setValue(accesscor, range, scale) {
        accesscor.base(Math.floor(this._rollSingle(range, scale)));
    }

    /**
     * 
     * @param {EquipmentTemplate} template 
     */
    generate(template, scale = 1) {
        const e = new Equipable(template.name, template.description, Equipable.Type.WEAPON, template.icon);
        const baseValues = [
            [e.stats.accuracy, template.accuracy, scale],
            [e.stats.actionsPerRound, template.actionsPerRound, scale],
            [e.stats.stability, template.stability, scale],
            [e.stats.damage, template.damage, scale]
        ];
        
        baseValues.forEach( pair => {
            const [accesscor, range, scaling] = pair;
            this._setValue( /**@type {CombatStats.Accesscor} */ (accesscor), /**@type {Range} */ (range), scaling || 1);
        });

        e.stats.optimalRange.min(Math.floor(this._rollSingle(template.lowerOptimialRange, 1)));
        e.stats.optimalRange.max(Math.floor(this._rollSingle(template.upperOptimalRange, 1)));

        e.stats.damage.min(Math.floor(this._rollSingle(template.damage, 1)));
        e.stats.damage.max(Math.floor(this._rollSingle(template.damage, 1)));

        return e;
    }

    /**
     * 
     * @param {Random} rng 
     */
    setRandomNumberGenerator(rng) {
        this._rng = rng;
    }
    

}