const GameEvents = Object.freeze({
    MISSION_SUCCESSFUL: "MISSION_SUCCESSFUL",
    MISSION_FAILED: "MISSION_FAILED",
    SURVIVOR_DIED: "SURVIVOR_DIED",
    LOOT_FOUND: "LOOT_FOUND",
    ROUND_END: "ROUND_END",
    WEAPON_CRAFTED: "WEAPON_CRAFTED"
});

class WeaponCraftEvent {

    /**
     * @param {Loot.Equipment} result 
     */
    constructor(result){
        this._result = result;
    }

    get result(){
        return this._result;
    }
}

class SurvivorDeathEvent {
    constructor(deadSurvivor, circumstances = "Unknown"){
        this._survivor = deadSurvivor;
        this._cirumstances = circumstances;
    }

    /**
     * @returns {Survivor} The Survivor that died.
     */
    get survivor(){
        return this._survivor;
    }

    get cirumstances(){
        return this._cirumstances;
    }
}

class LootEvent {
    /**
     * 
     * @param {[Loot]} loot 
     */
    constructor(loot){
        this._loot = loot.slice(0);
    }

    /**
     * @returns {[Loot]}
     */
    get loot(){
        return this._loot;
    }
}

class RoundEndEvent {
    constructor(roundNr){
        this._roundNr = roundNr;
    }

    /**
     * @returns {number} The number of the round that ended.
     */
    get roundNr(){
        return this._roundNr;
    }
}

class MissionEvent {
    constructor(mission, survivors){
        this._mission = mission;
        this._survivors = survivors;
    }

    /**
     * Returns the party of the mission equivalent to: event.mission.getParty()
     * @returns {[Survivor]}
     */
    get survivors(){
        return this._survivors;
    }

    /**
     * @returns {Mission} The mission. Use the state attribute from the mission to see if it failed or not.
     */
    get mission(){
        return this._mission;
    }
}

/**
 * Utillity class for dispatching events to subscribed events.
 */
class EventDispatcher {
    constructor(){
        this._eventmap = new Map();
    }

    /**
     * Checks if the given event-name is a legal event.
     * Legal events are defined in the global Events-object.
     * @param {string} event 
     */
    _isLegalEvent(event) {
        return GameEvents[event] ? true : false;
    }

    _singleInstanceEventList(event){
        let list = this._eventmap.get(event);
        if(list){
            return list;
        }
        list = [];
        this._eventmap.set(event,list);
        return list;
    }

    dispatchEvent(event, ...args){
        if(!this._isLegalEvent(event)){
            throw "EventDispatcher: event '" + event + "'" + " is not supported";
        }
        this._singleInstanceEventList(event)
        .forEach( callback => callback(event, ...args));
        return this;
    }

    /**
     * 
     * @param {string} event The Name of the event
     * @param {function(event)} callback 
     */
    subscribe(event, callback){
        if(!this._isLegalEvent(event)){
            throw "EventDispatcher: event '" + event + "'" + " is not supported";
        }
        this._singleInstanceEventList(event).push(callback);
        return this;
    }

    unsubscribe(callback, event = null){
        const removeAllFromList = eventName => {
            const listener = this._singleInstanceEventList(eventName);
            let index = -1;
            while( (index = listener.indexOf(callback) )  !== -1 ){
                listener.splice(index,0);
            }
        };
        if(event){
            removeAllFromList(event);
        }else{
            this._eventmap.forEach( (key,list) => {
                removeAllFromList(key);
            });
        }
        return this;
    }
}

class EventLogger{

    /**
     * 
     * @param {EventDispatcher} dispatcher 
     */
    constructor(dispatcher){
        for( let key in GameEvents){
            console.log("event-logger: event " + key);
            const eventName = GameEvents[key];
            dispatcher.subscribe(eventName, (...args) => {
                console.log(...args);
            });
        }
    }
}