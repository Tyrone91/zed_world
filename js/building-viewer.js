(function(){
    window.addEventListener('load', event => {
        console.log("ui loaded");
        $('.building-viewer-container').each( (index,element) => {
            const viewer = new UI.BuildingViewer();
            $(element).append(viewer.domElement);
            console.log("view found");
        });
    });
}());

var UI = window.UI || {};
UI.BuildingViewer = function(){
    this.domElement = document.createElement('div');
    this.domElement.classList.add('building-viewer');
    this._create();
}
UI.BuildingViewer.prototype = {
    _create: function(){
        const self = this;
        const buildings = GameContext.buildings();
        const camp = GameContext.camp();
        buildings.forEach( building => {
            if(!building.viewable()){
                return;
            }
            $(self.domElement).append(self._buildingPanel(building, camp));
        });
    },
    _buildingPanel: function(building, camp){
        const self = this;
        const panel = $('<div>');
        panel.addClass('building-panel');
        panel.text(building.name());
        panel.on('click', event => {
            console.log("Hello Wolrd");
            building.upgrade(camp);
        });
        return panel;
    }
}
