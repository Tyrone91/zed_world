class MessageCenter {
    constructor(eventDispatcher){
        this.eventDispatcher = eventDispatcher;
        this._changeListener =  [];
        this._newMessageListener = [];
        this._collectedEvents = [];
        const userRelevantEvents = [
            GameEvents.MISSION_SUCCESSFUL,
            GameEvents.MISSION_FAILED,
            GameEvents.SURVIVOR_DIED,
            GameEvents.LOOT_FOUND
        ];
        userRelevantEvents.forEach(eventName => {
            eventDispatcher.subscribe(eventName, (eventName, event) => {
                const data = {name: eventName, event: event};
                this._collectedEvents.push(data);
                this._changeListener.forEach( callback => callback() );
                this._newMessageListener.forEach( listener =>  listener(data) );
            });
        });
    }

    getAllEvents(){
        return this._collectedEvents;
    }

    deleteEvent(event){
        const index = this._collectedEvents.indexOf(event);
        if(index === -1){
            throw "MessageCenter: Event not found";
        }
        this._collectedEvents.splice(index,1);
        this._changeListener.forEach( callback => callback() );
        return this;
    }

    deleteAllEvents(){
        this._collectedEvents = [];
        this._changeListener.forEach( callback => callback() );
        return this;
    }

    getEventCount(){
        return this._collectedEvents.length;
    }

    /**
     * 
     * @param {function(event)} callback 
     */
    addChangeListener(callback){
        this._changeListener.push(callback);
    }

    addNewMessageListener(callback){
        this._newMessageListener.push(callback);
    }
}