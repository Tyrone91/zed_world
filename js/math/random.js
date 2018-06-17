const MAX_VALUE = 0x7fffffff;
const PARAMETER = 48271;

/**
 * Park-Miller Algorithem implementation.
 * Source: https://en.wikipedia.org/wiki/Lehmer_random_number_generator
 */
export class Random{

    constructor(seed){
        const N = MAX_VALUE;
        const G = PARAMETER;

        this._nextRand = function(){
            const div = seed / (N / G);
            const rem = seed % (N / G);

            const a = rem * G;
            const b = div * (N % G);

            seed = a > b ? (a-b) : (a  + (N - b) );
            return seed;
        };
    }

    /**
     * @returns {number}
     */
    nextInt(){
        return this._nextRand();
    }

    /**
     * @returns {number}
     */
    next(){
        return this._nextRand() / MAX_VALUE;
    }

    /**
     * @returns {number}
     */
    inBetween(low, upper = MAX_VALUE){
        const f = this.nextInt() / MAX_VALUE;
        return Math.floor(low + ( (upper-low) * f ));
    }



}