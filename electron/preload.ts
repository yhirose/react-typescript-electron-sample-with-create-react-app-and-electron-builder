const { ipcRenderer, contextBridge } = require("electron");

export interface DataReceivedObject {
  buff: Buffer
}

export interface ErrorReceivedObject {
  message: string;
  type: string;
}

const exposedAPI = {
  connect(host: string, port: number) {
    ipcRenderer.send("CONNECT_TO_SERVER", { host, port });
  },
  sendData(message: string) {
    ipcRenderer.send("SEND_DATA", message);
  },
  onDataReceived(callback: (data: DataReceivedObject) => void) {
    ipcRenderer.on("DATA_RECEIVED", (event, data) => {
      callback(data);
    });
  },
  onErrorReceived(callback: (error: ErrorReceivedObject) => void) {
    ipcRenderer.on("ERROR_RECEIVED", (event, error) => {
      callback(error);
    });
  },
} 

contextBridge.exposeInMainWorld("backendAPI", exposedAPI); 