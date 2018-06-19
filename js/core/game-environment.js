import { GameCalculator } from "./game-calculator.js";

export class GameEnvironment {
    constructor(){
        this._calculator = new GameCalculator({
            addativeModifiersOn: false
        });
    }

    calculator(){
        return this._calculator;
    }
}

export const ENVIRONMENT = new GameEnvironment();


