
export class BaseLoot {

    constructor(type, name = "NO_NAME", desc = "NO_DESC") {
        this._type = type;
        this._name = name;
        this._description = desc;
    }

    /**
     * Visitor-Pattern.
     * Calls the representive function of the collector.
     *
     */
    receive(collector) { // I CAN NOT ADD A REFERENCE HERE BECAUSE THAT WOULD LEAD TO AN CIRCULAR IMPORT.
        throw "Must be implemented by derived classes"
    }

    /**
     * The translation key for the name of the loot.
     */
    get name() {
        return this._name;
    }

    /**
     * The translation key for the description of the loot.
     */
    get description() {
        return this._description;
    }

    /**
     * The type of the loot.
     */
    get type() {
        return this._type;
    }
}