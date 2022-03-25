export interface IBackendAPI {
    sendData: (string) => Promise<void>,
  }
  
  declare global {
    interface Window {
      backendAPI: IBackendAPI
    }
  }