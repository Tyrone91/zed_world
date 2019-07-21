import { ViewComponent } from "../view-component.js";

export class ListView extends ViewComponent {

    /**
     * 
     * @param  {()=>ViewComponent[]} elementSupplier 
     */
    constructor(elementSupplier) {
       super(); 
       this._elementSupplier = elementSupplier;
       this.clazz("list-view")
    }

    update() {
        const root = this.rootElement();
        root.empty();
        const elements = this._elementSupplier();
        elements.forEach( e => {
            root.append(e.domElement());
        });
    }
}