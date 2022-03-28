const { ipcRenderer, contextBridge } = require("electron");

const exposedAPI = {
  connect(host: string, port: number) {
    ipcRenderer.send("CONNECT_TO_SERVER", { host, port });
  },
  sendData(message: string) {
    ipcRenderer.send("SEND_DATA", message);
  },
  onDataReceived(callback: (data: string) => void) {
    ipcRenderer.on("DATA_RECEIVED", (event, data) => {
      callback(data);
    });
  }
} 

contextBridge.exposeInMainWorld("backendAPI", exposedAPI); 