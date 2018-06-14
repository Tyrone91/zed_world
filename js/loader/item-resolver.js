import { TemplateLoader } from "./template-loader.js";

export class ItemResolver{
    /**
     * 
     * @param {TemplateLoader} templateLoader 
     */
    constructor(templateLoader){
        this._templateLoader = templateLoader;
    }

    /**
     * 
     * @param {string} id 
     */
    resolveReference(id){
        return this._templateLoader.getTemplate(id);
    }
}