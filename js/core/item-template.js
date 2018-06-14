class Range {
    constructor(lower = 0, upper = 0){
        this.lower = lower;
        this.upper = upper;
    }
}

export class ItemTemplateStats {
    constructor(){
        this.damage = new Range();
        this.optimalrange = new Range();
        this.hitchance = new Range();
    }
}


export class ItemTemplate {
    constructor(id){
        this.referenceId =  id;
        this.stats = new ItemTemplateStats();
    }
}