export class Resource{
    /**
     * 
     * @param {string} type 
     * @param {number} amount 
     */
    constructor(type, amount){
        this._type = type;
        this._amount = amount;
    }

    /**
     * @returns {number}
     */
    get amout(){
        return this._amount;
    }

    /**
     * @return {string}
     */
    get type(){
        return this._type;
    }

    /**
     * Changes the value of the resource
     * @param {number} value 
     */
    changeAmount(value){
        const newValue = this._amount + value;
        if(newValue < 0){
            this._amount = 0;
        }else{
            this._amount = newValue;
        }
        return this;
    }

    /**
     * Note: Doesn't check if the both resources are equal.
     * @param {Resource} resource 
     */
    add(resource){
        this._amount += resource.amout;
        return this;
    }

    /**
     * Note: Doesn't check if the both resources are equal.
     * @param {Resource} resource 
     */
    subtract(resource){
        const newValue = this._amount - resource.amout;
        if(newValue < 0){ // Do not allow negative amount
            this._amount = 0;
        }else{
            this._amount = newValue;
        }
        return this;
    }

    /**
     * Treats this resource as cost.
     * The given Resource is the payment.
     * If enough resources are given it will reduce the amount on the given resource and return true
     * otherwise false
     * Note: Doesn't check if the both resources are equal.
     * @param {Resource} resource 
     * @returns {boolean} true if the given resources are enough to pay.
     */
    pay(resource){
        if( (resource.amout - this._amount) >= 0 ){
            resource.subtract(this);
            return true;
        }
        return false;
    }
}

Resource.Type = Object.freeze({
    FOOD: "RESOURCE_TYPE_FOOD",
    METAL: "RESOURCE_TYPE_METAL",
    WOOD: "RESOURCE_TYPE_WOOD"
});

export class ResourceWood extends Resource{
    constructor(amout = 0){
        super(Resource.Type.WOOD, amout);
    }
}

export class ResourceFood extends Resource{
    constructor(amount = 0){
        super(Resource.Type.FOOD, amount);
    }
}

export class ResourceMetal extends Resource {
    constructor(amount){
        super(Resource.Type.METAL, amount);
    }
}