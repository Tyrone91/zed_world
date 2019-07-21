import { ViewComponent } from "../view-component.js";
import { ActionButton } from "../action-button.js";
import { TemplateDesignerUI } from "./template-designer-ui.js";
import { HorizontalMenu } from "../util/horizontal-menu.js";

export class DevToolsHub extends ViewComponent {

    constructor() {
        super();

        /**@type {ViewComponent} */
        this._currentView = new TemplateDesignerUI();

        this._menu = new HorizontalMenu();
        this._menu.menu("Template Designer", () => this._switchTo( new TemplateDesignerUI()));

    }

    /**
     * 
     * @param {ViewComponent} target 
     */
    _switchTo(target) {
        this._currentView = target;
        this.update();
    }

    update() {
        const root = this._rootElement;
        root.empty();
        root.append(this._menu.domElement());
        root.append(this._currentView.domElement());
    }
}