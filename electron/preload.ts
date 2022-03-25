const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("backendAPI", {
    sendData(message: string) {
      ipcRenderer.send("SEND_DATA", message);
    },
});