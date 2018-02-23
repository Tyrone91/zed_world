/**
 * @class
 */
class Sortable{
    /**
     * @param {[any]} list 
     * @param {function} elementBuilder Should return an HTMLDivElement
     */
    constructor(list, elementBuilder){

        this._list = list;
        this._builder = elementBuilder;
        this._selectedIndex = -1;
        /**@type {HTMLDivElement} */
        this._selectedElement = null;
        this._targetIndex = -1;

        /**@type {HTMLDivElement} */
        this._domElement = null;

        /**@type {HTMLDivElement} */
        this._dropzoneElement = document.createElement("div");
        this._dropzoneElement.classList.add("sortable-list-element", "dropzone");
    }
    
    /**
     * @param {HTMLDivElement} container 
     * @param {HTMLDivElement} listElement 
     * @param {number} indexOfElement 
     */
    _applyEventHandling(container,listElement, indexOfElement){
        const calculateDirection = () => {
            const elementBounds = listElement.getBoundingClientRect();
            const myXCenter = elementBounds.x + (elementBounds.width/2);
            const myYCenter = elementBounds.y + (elementBounds.height/2);

            const dropBounds = this._dropzoneElement.getBoundingClientRect();
            const dropXCenter = dropBounds.x + (dropBounds.width/2);
            const dropYCenter = dropBounds.y + (dropBounds.height/2);

            const right = myXCenter > dropXCenter;
            const left = myXCenter < dropXCenter;
            const top = myYCenter < dropYCenter;
            const bottom = myYCenter > dropYCenter;

            console.log("I am " + (right ? "right " : "") + (left ? "left " : "") + (top ? "top " : "") + (bottom ? "bottom " : ""));
            return {
                right: right,
                left: left,
                top: top,
                bottom: bottom
            };
        };
        listElement.addEventListener("mousedown", event => {
            this._selectedIndex = indexOfElement;
            this._selectedElement = listElement;
            container.insertBefore(this._dropzoneElement, listElement.nextSibling);
            listElement.classList.add("active-list-element");
            this._setPositionOfElement(listElement, event);
        });
        // old way of switching dropzone but is not as smooth as the new way over actual position
        /*
        listElement.addEventListener("mouseenter", event => {
            if(!this.isDragging()){
                return;
            }
            container.insertBefore(this._dropzoneElement, listElement.nextSibling);
            this._targetIndex = indexOfElement;
        });
        listElement.addEventListener("mouseout", event => {
            if(!this.isDragging()){
                return;
            }
            container.insertBefore(this._dropzoneElement, listElement.nextSibling);
            this._targetIndex = indexOfElement;
        });
        */
        listElement.addEventListener("mouseenter", event => {
            if(!this.isDragging() ){
                return;
            }

        });
        listElement.addEventListener("mouseenter", event => {
            if(!this.isDragging() ){
                return;
            }
            
        });
        listElement.addEventListener("mousemove", event => {
            if(!this.isDragging() ){
                return;
            }

            let elementCenter = listElement.getBoundingClientRect().y + (listElement.getBoundingClientRect().height/2);
            let activeCenter = this._selectedElement.getBoundingClientRect().y + (this._selectedElement.getBoundingClientRect().height/2); 

            const dir = calculateDirection();
            if(dir.right || dir.left){
                elementCenter = listElement.getBoundingClientRect().x + (listElement.getBoundingClientRect().width/2);
                activeCenter = this._selectedElement.getBoundingClientRect().x + (this._selectedElement.getBoundingClientRect().width/2);
            }

            if(this._dropzoneElement.nextSibling === listElement){
                if(elementCenter > activeCenter){
                    return;
                }
                container.insertBefore(this._dropzoneElement, listElement.nextSibling);
                //right now I can't tell why I have to use listElement here and dropzone by the other case
                // If they are the same it doesn't right.
                this._targetIndex = indexOfElement;
            }else/*(this._dropzoneElement.previousSibling === listElement)*/{ // previous sibling TODO: this is not true inside a grid. In a grid a element under the dropzone ist not necessarily a sibling. If both are wrong I hava to implement a linear search to find the right element via ist position
                if(elementCenter < activeCenter){
                    return;
                }
                container.insertBefore(this._dropzoneElement, this._dropzoneElement.previousSibling);
                this._targetIndex = indexOfElement;
            }
        });
    }

    /**
     * 
     * @param {HTMLDivElement} target 
     * @param {MouseEvent} event 
     */
    _setPositionOfElement(target, event){
        const localX = event.clientX - this._domElement.getBoundingClientRect().x;
        const localY = event.clientY - this._domElement.getBoundingClientRect().y;
        const posX = localX - (target.clientWidth/2);
        const poxY = localY - (target.clientHeight/2);
        target.style.left = posX + "px";
        target.style.top = poxY + "px";
    }

    _createDomElement(){
        const element = document.createElement("div");
        const reset = () => {
            this._selectedElement.classList.remove("active-list-element");
            this._selectedElement = null;
            if(this._domElement.contains(this._dropzoneElement) ){
                this._domElement.removeChild(this._dropzoneElement);
            }
        };
        element.classList.add("sortable-list");
        element.addEventListener("mousemove", event =>{ //TODO: for performance only add listener then it is needed and remove it afterwards
            if(!this.isDragging()){
                return;
            }
            this._setPositionOfElement(this._selectedElement,event);
        });
        element.addEventListener("mouseup", event => {
            if(!this.isDragging()){
                return;
            }
            this._moveArrayEntries(this._selectedIndex, this._targetIndex);
            reset();
        });
        this._createListElements(element);
        this._domElement = element;
    }

    _createListElements(container){
        for(let index = 0; index < this._list.length; ++index){
            const data = this._list[index];
            const listElement = this._builder(data);
            listElement.classList.add("sortable-list-element");
            this._applyEventHandling(container,listElement,index);
            container.append(listElement);
        }
    }

    _moveArrayEntries(currentIndex, targetIndex){
        if(currentIndex === targetIndex){
            return;
        }
        //console.log("current-index: " + currentIndex);
        //console.log("target-index: " + (targetIndex+1));
        while(this._domElement.firstChild){
            this._domElement.removeChild(this._domElement.firstChild);
        }
        if(currentIndex < targetIndex){
            this._list.splice(targetIndex+1,0, this._list[currentIndex]);
            this._list.splice(currentIndex,1);
        }else if(currentIndex > targetIndex){
            const tmp = this._list[currentIndex];
            this._list.splice(currentIndex,1);
            this._list.splice(targetIndex+1,0, tmp);
        }
        console.log(this._list);
        this._createListElements(this._domElement);
    }

    

    isDragging(){
        return this._selectedElement !== null;
    }


    get domElement(){
        if(!this._domElement){
            this._createDomElement();
        }
        return this._domElement;
    }
}


