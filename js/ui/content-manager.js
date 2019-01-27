export class ContentManager{
    constructor(contentTarget, menuTarget, sidePanelTarget, headerTarget){
        this._contentStack = [];
        /**@type {Map<string,(any)=>void>} */
        this._registeredContent =  new Map();
        this._contentTarget = contentTarget;
        this._menuTarget = menuTarget;
    }

    /**
     * @param {string} contentId
     * @param {...any} params
     */
    _getContentById(contentId, ...params){
        if(!this._registeredContent.has(contentId)){
            throw `Unknows id:=${contentId}. Can not show content`;
        }
        return this._registeredContent.get(contentId);
    }

    /**
     * 
     * @param {string} contentId 
     * @param {(any)=>void} callback 
     */
    registerContent(contentId, callback){  
        this._registeredContent.set(contentId,callback);
    }

    /**
     * 
     * @param {string} contentId 
     * @param {...any} params 
     */
    setContentById(contentId, ...params){
        this.setContent(() => {
            return this._getContentById(contentId).bind(this, ...params);
        });
    }

    pushContentById(contentId, ...params){
        this.pushContent(() => {
            return this._getContentById(contentId).bind(this, ...params);
        });
    }

    pushContent(callback){
        this._contentStack.push(callback);
        this.render(callback());
    }

    popContent(){   
       this._contentStack.pop();
       this.render(this._contentStack[this._contentStack.length-1]());
    }

    setContent(callback){
        this._contentStack = [callback];
        this.render(callback());
    }

    render(element){
        $("#content-header-back-bttn").remove();
        if(this._contentStack.length > 1){
            $("#content-header").append(
                $("<button>")
                    .prop("id", "content-header-back-bttn")
                    .text("BACK")
                    .on("click", () => {
                        this.popContent();
                        
                    })
            );
        }
        
        const target = $(this._contentTarget);
        //target.html(element); //this would remove the event listeners from the dom. We don't want that because then we would attach the listener back if we pop the stack.
        /**@type {HTMLElement} */
        
        const plainDom = target[0];
        while(plainDom.firstChild){
            plainDom.removeChild(plainDom.firstChild);
        }
        target.append(element);
        //plainDom.appendChild(element()[0]);
        
    }

    addMenuEntry(name, action){
        const bttn = $("<button>");
        bttn.text(name);
        bttn.click(action);
        
        $(this._menuTarget).append(bttn);
    }

    update() {
        const top = this._contentStack[this._contentStack.length-1];
        if(top) {
            this.render(top());
        }
    }


}