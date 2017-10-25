(function(){
    window.addEventListener('load', event => {
        $('.resource-viewer-container').each( (index, element) => {
            console.log("resource-viewer found");
            const viewer = new window.UI.ResourceViewer();
            $(element).append(viewer.domElement);
        });
    });
}());
var UI = window.UI || {};
UI.ResourceViewer = function(){
    this.domElement = $('<div>');
    this.domElement.addClass('resource-viewer');
    this._create();
}
UI.ResourceViewer.prototype = {
    _create: function(){
        const self = this;
        const camp = window.GameContext.camp();
        camp.resourcesAsArray().forEach( res => {
            $(self.domElement).append(self._resourcePanel(res,camp));
        });
    },
    _resourcePanel: function(resource,camp){
        const panel = $('<div>');
        const name = $('<p>');
        const value = $('<p>');

        name.text(resource.name());
        value.text(resource.value());
        panel.append(name);
        panel.append(value);

        resource.addOnChangeListener( (resource, oldValue, newValue) => {
            const cap = camp.resourceCap(resource.type());
            if(camp){
                value.text(newValue + "/" + cap);
            }else{
                value.text(newValue);
            }
        });

        panel.addClass('resource-panel');

        return panel;
    }
}
