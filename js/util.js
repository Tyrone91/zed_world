var Util = {
    /**
     * Checks if the given object exists. Not null or undefined.
     * @param  {object} pivot The checked object
     * @return {boolean}       true if it exists otherwise false-
     */
    exists: function(pivot){
        return typeof pivot !== 'undefined' && (pivot || typeof pivot === 'number');
    },
    /**
     * only calls the function if it is not null or undefined. No error is thrown otherwise.
     * @param  {function} func The function that shall be invoked
     * @return {any}      If the function exists and has a return type this will return the value of the passed function.
     *                    otherwise it will return undefined.
     */
    safeInvoke: function(func){
        if(typeof func !== 'undefined' && func){
            return func;
        }
        return () => {};
    },
    /**
     * Returns a function that will call a function with the givenName on all objects in the list that have the function.
     * @param  {array} list         A list of objects that will be called. Every list that support forEach is allowed
     * @param  {string} functionName The name of the function that will be called.
     * @return {function}             Helper function that will handle its arguments to the real function.
     */
    onEach(list,functionName){
        // I could have made this one function that will take the first two arguments as parameters and the rest will be forwarded to the actual function.
        // I didn't to that because I like the seperation of arguments for both funtion.
        const res = function(){
            list.forEach(ele => {
                if(!ele[functionName]){
                    return;
                }
                ele[functionName].apply(ele,arguments);
            })
        }
        return res;
    },
    /**
     * Checks if the given objects exits and throws an error if not.
     * @param  {objects} pivot The chcked object.
     * @param  {object} error Optional error message.
     * @return {object}       The given objects if it exits.
     */
    require: function(pivot, error){
        var self = this;
        if(!self.exists(pivot)){
            let msg = error || "The element isn't allowed to be null or undefined";
            throw msg;
        }
        return pivot;
    },
    /**
     * return the value of the given property name if no value was given or sets the
     * the property to the given value and returns this;
     * @param  {object} target The objects that will be returned or modified.
     * @param  {string} name   name of the property
     * @param  {object} value  optional object that will be set to the given property
     * @return {object}        The value of the property if no value was given, otherwise the target.
     */
    setOrGet: function(target, name, value){
        //access check
        if(!target.hasOwnProperty(name)){
            throw "Failed to set or get field of '"+target+"' The object doesn't hava a field: " + name;
        }
        let self = this;
        if(self.exists(value)){
            target[name] = value;
            return target;
        }else{
            return target[name];
        }
    },
    valueOr(object,fallback){
        const self = this;
        if(self.exists(object)){
            return object;
        }else{
            return fallback;
        }
    },
    /**
     * Returns a random number.
     * @param  {number} mim lower limit of the number (inclusiv)
     * @param  {number} max uppper limit of the number (exclusiv)
     * @return {number}     A number between min and max or 0 and 1(exclusiv) if undefined.
     */
    random(min, max){
        if( (min && max) && (min > max)){
            throw "random: max "+ max +"' mus't be greater then min '" + min + "";
        }
        if(!min){
            min = 0;
        }
        if(!max){
            max = 0;
        }
        return (Math.random() * (max - min)) + min;
    },
    /**
     * Same as random but only integer numbers a returned
     * @param  {number} mim lower limit of the number (inclusiv)
     * @param  {number} max uppper limit of the number (exclusiv)
     * @return {number}     A number between min and max or 0.
     */
    randomInt(min, max){
        return Math.floor(this.random(min,max));
    },
    /**
     * Same as random but only integer numbers a returned
     * @param  {number} mim lower limit of the number (inclusiv)
     * @param  {number} max uppper limit of the number (inclusiv)
     * @return {number}     A number between min and max or 0.
     */
    randomIntInclusive(min, max){
        return Math.floor(this.random(min,max+1));
    },
    pairOf: function(first, second){
        return {
            first : first,
            second : second
        };
    },

    pointOf: function(x,y){
        return {
            x : x,
            y : y
        };
    }
}
