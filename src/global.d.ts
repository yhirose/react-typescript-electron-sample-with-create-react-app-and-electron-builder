export interface DataReceivedObject {
  buff: Buffer
}

export interface ErrorReceivedObject {
  message: string;
  type: string;
}

export interface IBackendAPI {
  connect: (host: string, port: number) => void;
  sendData: (string) => Promise<void>;
  onDataReceived: (callback: (data: DataReceivedObject) => void) => void;
  onErrorReceived: (callback: (error: ErrorReceivedObject) => void) => void;
}

declare global {
  interface Window {
    backendAPI: IBackendAPI
  }
}