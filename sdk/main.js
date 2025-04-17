console.log("Alicorn SDK")
const { contextBridge, ipcRenderer } = require('electron');
global.windowId = null;

let host = require('@electron/remote').getCurrentWindow().webContents.executeJavaScript;

ipcRenderer.on('window-id', (event, data) => {
    console.log("[SDK] Alicorn Window ID: " + data);
    contextBridge.exposeInMainWorld('AlicornWindowID', data);
    global.windowId = data;
})

contextBridge.exposeInMainWorld('AlicornRoot', require('path').dirname(__dirname));
contextBridge.exposeInMainWorld('AlicornKeyboardHandler', require('fs').readFileSync("sdk/keyboard.js").toString());

contextBridge.exposeInMainWorld('AlicornSDK', {
    init: async () => {
        let api = {};

        console.log("[SDK] Establishing features set... This may take a while.");
        let features = await host("Object.keys(AlicornSDK)");
        console.log("[SDK] Established features set");

        for (let feature of features) {
            api[feature] = (options) => {
                return host("AlicornSDK[" + JSON.stringify(feature) + "](\"" + windowId + "\", " + JSON.stringify(options) + ");");
            };
        }

        return api;
    }
})