import { Combatant } from "./combatant.js";

export class CombatAction {
    constructor(executor, target, type){
        this._executor = executor;
        this._target = target;
        this._type = type;
    }

    /**
     * @returns {Combatant}
     */
    get executor(){
        return this._executor;
    }

    /**
     * @returns {Combatant}
     */
    get target(){
        return this._target;
    }

    get type(){
        return this._type;
    }
}

export class AttackAction extends CombatAction{
    constructor(executor,target, damage, hitchance, hit){
        super(executor, target, AttackAction.Type);
        this._inflictedDamage = damage;
        this._hitchance = hitchance;
        this._hit = hit;
    }

    /**
     * @returns {number}
     */
    get inflictedDamage(){
        return this._inflictedDamage;
    }

    /**
     * @returns {number}
     */
    get hitchance(){
        return this._hitchance;
    }

    /**
     * True if the target was hit. False otherwise
     * @returns {boolean}
     */
    get hit(){
        return this._hit;
    }
}

AttackAction.Type = "ATTACK_ACTION";

