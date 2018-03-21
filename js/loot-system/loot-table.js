class LootContainer{
    /**
     * 
     * @param {any} loot 
     * @param {number} weight 
     */
    constructor(loot, weight){
        this._weight = weight;
        this._loot = loot;
    }

    get loot(){
        return this._loot;
    }

    get weight(){
        return this._weight;
    }
}

export class LootTable{
    /**
     * 
     * @param {[function]} lootReceivers Callbacks that receives the rolled loot
     */
    constructor(...lootReceivers){
        /**@type [LootContainer] */
        this._lootList = [];
        this._receivers = [...lootReceivers];
        
    }

    _calcTotalWeight(){
        return this._lootList.reduce( (total, container) => total + container.weight , 0);
    }

    /**
     * 
     * @param {any} loot 
     * @param {number} weight 
     */
    add(loot,weight){
        const container = new LootContainer(loot, weight);
        this._lootList.push(container);


        return this;
    }

    /**
     * 
     * @param {number} times Optional - How many rolls should happen  
     */
    roll(times=1){
        while(times--){
            const totalWeight = this._calcTotalWeight();
            const hit = Math.random() * totalWeight;
            let offset = 0;
            for(const container of this._lootList){
                const containerRange = offset + container.weight;
                if( offset <= hit && (offset + container.weight) > hit){
                    this._receivers.forEach( receiver => receiver(container.loot) );
                    break;
                }else{
                    offset += container.weight;
                }
            }
        }
        return this;
    }

    /**
     * @returns [{chance: number,loot: string}]
     */
    getChances(){
        const totalWeight = this._calcTotalWeight();
        return this._lootList.map( container => {
            return {
                chance: container.weight / totalWeight,
                loot: container.loot.toString(),
            };
        });
    }

    _printChances(){
        this.getChances().forEach( entry => console.log(entry.loot + ": " + (entry.chance*100).toFixed(2) + "%") );
        return this;
    }
}