import {DevToolsHub} from './ui/dev-tools/dev-tools-hub.js'

window.addEventListener("load", e => {
    const dev = new DevToolsHub();
    $(document.body).append(dev.domElement());
});