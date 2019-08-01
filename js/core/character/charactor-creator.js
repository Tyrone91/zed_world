import { Survivor } from "./survivor.js";

export class CharacterCreator {

    constructor(rng) {
        this._rng = rng;
        this._portraits = [];
    }

    _getRandomPortrait() {
        const index = this._rng.inBetween(0, this._portraits.length);
        return this._portraits[index];
    }

    _getRandomName() {
        return "";
    }
    
    set portraitsList(list) {
        this._portraits = list;
    }

    createRandomCharacter(name = this._getRandomName() ) {
        const rng = this._rng;
        const s = new Survivor();
        s.name(name);
        s.portrait = this._getRandomPortrait();
        s.getMissionModifiers().fill(1);
            //.forEach( (x,y) => s.getMissionModifiers().setCell(x,y, rng.inBetween(0.5,2) ) );

        s.combatstats.forEach( (x,y) => s.combatstats.setCell(x,y, rng.inBetween(5, 50) ));
        return s;
    }
}