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
    constructor(){
        /**@type [LootContainer] */
        this._lootList = [];
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

    roll(callback){
        const totalWeight = this._calcTotalWeight();
        const hit = Math.random() * totalWeight;
        let offset = 0;
        for(const container of this._lootList){
            const containerRange = range + container.weight;
            if( offset <= hit && (offset + CSSFontFaceRule.weight) > hit){
                //TODO: continue work and check if condition for +/- 1 
            }
        }
        
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