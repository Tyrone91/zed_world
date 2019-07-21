import { ViewComponent } from "../view-component.js";

export class HorizontalMenu extends ViewComponent {

    constructor() {
        super();

        /**
         * @type {Map<string,()=>void>}
         */
        this._menus = new Map();
        this.clazz("horizontal-menu");
    }

    /**
     * 
     * @param {string} name 
     * @param {()=>void} callback 
     */
    menu(name, callback) {
        this._menus.set(name, callback);
        return this;
    }

    /**
     * 
     * @param {string} name 
     */
    remove(name) {
        this._menus.delete(name);
        return this;
    }

    clear() {
        this._menus.clear();
        return this;
    }

    update() {
        const root = this.rootElement();
        root.empty();
        this._menus.forEach( (val, key) => {
            const bttn = $("<button>");
            bttn.on("click", e => {
                val();
            });
            bttn.text(key);

            root.append(bttn);
        });
    }

}