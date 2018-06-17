import {Random} from "../math/random.js";
import {LootTable} from "../loot-system/loot-table.js";
import { LootReceiver } from "../loot-system/loot-receiver";
import {LootContainer} from "../loot-system/loot-container.js";
import { GameConstants } from "../core/game-constants.js";


export class LootDispatcher {

    /**
     * 
     * @param {Random} rng 
     * @param {LootTable} extraordinary 
     * @param {LootTable} rare 
     * @param {LootTable} common 
     */
    constructor(rng, extraordinary, rare, common){
        this._rng = rng;
        this._tables = {
            common: common,
            rare: rare ,
            extraordinary: extraordinary
        };
    }

    /**
     * 
     * @param {LootReceiver} receiver 
     */
    _dispatchLoot(table, receiver){

        /**
         * @type {LootContainer}
         */
        const res = table.roll(1, this._rng);

        if(res.type === LootContainer.Type.AMMO){
            receiver.addAmmo(res.loot);
            return;
        }

        if(res.type === LootContainer.Type.FOOD){
            receiver.addFood(res.loot);
            return;
        }

        if(res.type === LootContainer.Type.EQUIPMENT){
            receiver.addEquipment(res.loot);
            return;
        }
        
        
    }

    checkForDrops(receiver, modifiers, rng){

        if(GameConstants.MISSION.ALWAYS_ROLL_FOR_LOOT){
            this._dispatchLoot(this._tables.common, receiver);
            this._dispatchLoot(this._tables.rare, receiver);
            this._dispatchLoot(this._tables.extraordinary, receiver);
            return;
        }
        let dropped = false;

        const calc = ENVIRONMENT.calculator();
        let cmp = () => rng.inBetween(0,100);

        if(cmp() > calc.commonLootChance(modifiers,rng)){
            this._dispatchLoot(this._tables.common, receiver);
            dropped = true;
        }

        if(cmp() > calc.rareLootChance(modifiers,rng)){
            this._dispatchLoot(this._tables.rare, receiver);
            dropped = true;
        }

        if(cmp() > calc.extraordinaryLootChance(modifiers,rng)){
            this._dispatchLoot(this._tables.extraordinary, receiver);
            dropped = true;
        }

        return dropped;
    }


}