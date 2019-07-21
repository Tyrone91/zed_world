import { ViewComponent } from "../view-component.js";

export class NamedTextInput extends ViewComponent {

    /**
     * 
     * @param {string} name 
     * @param {Mode} mode 
     */
    constructor(name, multiline  = false, mode = NamedTextInput.Mode.INPUT) {
        super();
        this._name = name;
        this._callback = () => {};
        this._mode = mode;
        this._inputField = $(multiline ? "<textarea>" : "<input>").attr("type", "text").addClass("text-input");

        this.clazz("named-text-input");
        this._init();
    }

    _init() {
        const root = this.rootElement();

        const nameele = $("<span>").text(this._name);

        root.append(nameele, this._inputField);
    }

    /**
     * 
     * @param {(data:string)=>void} callback receives the input of the input field.
     */
    oninput(callback) {
        this._inputField.off("input");
        this._inputField.on(this._mode.type, () => {
            const val = /**@type {string} */(this._inputField.val());
            callback(val);
        });
        return this;
    }

    update() {
        
    }
}

class Mode {
    /**
     * 
     * @param {string} type 
     */
    constructor(type) {
        this._type = type;
    }

    get type() {
        return this._type;
    }
}

NamedTextInput.Mode = {
    INPUT: new Mode("input"),
    CHANGE: new Mode("change")
}