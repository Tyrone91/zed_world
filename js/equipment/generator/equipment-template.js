import { Range } from "../../util/range.js";
import { Equipable } from "../equipable.js";
import { LootTable } from "../../loot-system-v3/loot-table.js";

export class EquipmentTemplate {

    /**
     * 
     * @param {string} name
     * @param {string} rarity - LootTable.Rarity
     *
     */
    constructor(name, rarity, description = "") {
        this._icon = name;
        this._name = name;
        this._description = description;
        this._rarity = rarity;
        this._accuracy = new Range();
        this._damage = new Range();
        this._lowerOptimialRange = new Range();
        this._upperOptimialRange = new Range();
        this._actionsPerRound = new Range();
        this._stability = new Range();
    }

    get name() {
        return this._name;
    }

    get accuracy() {
        return this._accuracy;
    }

    get damage() {
        return this._damage;
    }

    get actionsPerRound() {
        return this._actionsPerRound;
    }

    get lowerOptimialRange() {
        return this._lowerOptimialRange;
    }

    get upperOptimalRange() {
        return this._upperOptimialRange;
    }

    get stability() {
        return this._stability;
    }

    set rarity(rarity) {
        this._rarity = rarity;
    }

    get rarity() {
        return this._rarity;
    }   

    /**
     * @param {string} icon;
     */
    set icon(icon) {
        this._icon = icon;;
    }

    get icon() {
        return this._icon;
    }

    set description(desc) {
        this._description = desc;
    }

    get description() {
        return this._description;
    }
}