function WindowManager(container){
    this._callStack = [];
    this._drawTarget = container;
}
WindowManager.prototype = {
    /**
     * @param {function} callback The function that will be called if the ui should be rendered
     */
    _render: function(){
        if(this._callStack.length < 1){
            throw "Empty Render Stack";
        }
        const callback = this._callStack[this._callStack.length-1];
        $(this._drawTarget).html(callback());
    },
    push: function(callback){
        this._callStack.push(callback);
        this._render();
    },
    pop: function(){
        this._callStack.splice(this._callStack.length - 1, 1);
        this._render();
    },
    set: function(callback){
        this._callStack = [];
        this.push(callback);
        this._render();
    },
    target: function(value){
        return Util.setOrGet(this, "_drawTarget", value);
    },
    render: function(){
        this._render();
    }
}
