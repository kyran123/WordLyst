const {
    contextBridge,
    ipcRenderer
} = require("electron");

const validChannels = [
    "minimize",
    "maximize",
    "close",
    "getWords",
    "showWords",
    "getDefinition",
    "getDefinitions",
    "showDefinition",
    "getDarkModeSetting",
    "setDarkModeSetting",
    "returnDarkModeSetting",
    "progress",
    "updateProgress",
    "showMainScreen",
    "checkVersion",
    "showVersionInfo"
];
window.onload = () => {
    // Expose protected methods that allow the renderer process to use
    // the ipcRenderer without exposing the entire object
    contextBridge.exposeInMainWorld("API", {
            //IPC renderer functionality
            receive: (channel, func) => { 
                if(validChannels.includes(channel)) {
                    ipcRenderer.on(channel, (event, ...args) => func(...args));
                }
            },
            send: (channel, data) => {
                if(validChannels.includes(channel)) {
                    ipcRenderer.send(channel, data);
                }
            }
        }
    );
}
