import { ViewComponent } from "../view-component.js";
import { NamedTextInput } from "../util/named-text-input.js";
import { ListView } from "../util/list-view.js";
import { HorizontalMenu } from "../util/horizontal-menu.js";
import { NamedRangeInput } from "../util/named-range-input.js";

export class TemplateDesignerUI extends ViewComponent {

    constructor(designer) {
        super();
        this._designer = designer;

        const menu = new HorizontalMenu()
            .menu("NEW", () => {})
            .menu("LOAD", () => {})
            .menu("SAVE", () => {});

        this._name = new NamedTextInput("Name");
        this._desc = new NamedTextInput("Description");
        this._accu = new NamedTextInput("Accuracy");
        this._stab = new NamedRangeInput("Stability");

        const supplier = () => [
            this._name,
            this._desc,
            this._accu,
            this._stab
        ];
        this.rootElement()
            .append(menu.domElement())
            .append(new ListView(supplier).domElement());
        this.clazz("template-designer");
    }

    update() {

    }
}