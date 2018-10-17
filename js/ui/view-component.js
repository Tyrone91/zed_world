import { ENVIRONMENT } from "../core/game-environment.js";
import { ContentManager } from "./content-manager.js";
import { TextResolver } from "../util/text-resolver.js";

export const CONTENT_MANAGER = new ContentManager("#content", "#game-menu");
export const DEFAULT_TEXT_RESOLVER = new TextResolver();


export class ViewComponent {

    constructor(id = "NO_ID_COMPONENT"){
        this._id = id;
        this._rootElement = $("<div>");
    }

    get manager(){
        return CONTENT_MANAGER;
    }

    get game(){
        return ENVIRONMENT;
    }

    get id(){
        return this._id;
    }

    clear(){
        this._rootElement.empty();
    }

    rootElement(){
        return this._rootElement;
    }

    update(){}

    domElement(){
        this.update();
        return this.rootElement();
    }

    resolve(key){
        return DEFAULT_TEXT_RESOLVER.resolve(key);
    }
}