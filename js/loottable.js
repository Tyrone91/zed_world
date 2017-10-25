function LootTable(){
    this._table = [];
    this._rangeList = [];
}

LootTable.prototype = {
    _totalWeight: function(){
        let total = 0;
        this._table.forEach(element => {
            total += element.weight;
        });
        return total;
    },
    addLoot: function(onDrop, weight, dropName){
        this._table.push({onDrop: onDrop, weight: weight, name: dropName});
        const totalWeight = this._totalWeight();
        this._rangeList = [];
        let count = 0;
        this._table.forEach(entry => {
            const min = count;
            const max = min + entry.weight;
            count = max;
            const data = {
                range: Range.of(min,max),
                onDrop: entry.onDrop
            };
            this._rangeList.push(data);
        });
        return (weight / totalWeight) * 100;
    },
    roll: function(){
        let loot = null;
        const weightRoll = Util.randomInt(0,this._totalWeight());
        this._rangeList.forEach( entry => {
            const min = entry.range.lower();
            const max = entry.range.upper();
            if(weightRoll >=  min && weightRoll < max){
                loot = entry.onDrop();
            }
        });
        if(loot){ // looks stupid but null is not undefined and I don't want set loot explicit to undefined
            return loot;
        }
    },
    dropChanceList: function(){
        const res = [];
        const total = this._totalWeight();
        this._table.forEach(entry => {
            const chance = (entry.weight / total) * 100;
            const data = {
                chance: chance,
                name: entry.name,
                toString: function(){
                    return "[" + this.name + " : " + this.chance + "%]";
                }
            };

            res.push(data);
        });
        return res;
    }
}
