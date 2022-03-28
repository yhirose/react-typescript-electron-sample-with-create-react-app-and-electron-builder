export interface DataReceivedObject {
  buff: {
    data: Buffer;
    type: string;
  };
}

export interface IBackendAPI {
  connect: (host: string, port: number) => void;
  sendData: (string) => Promise<void>;
  onDataReceived: (callback: (data: DataReceivedObject) => void) => void;
}

declare global {
  interface Window {
    backendAPI: IBackendAPI
  }
}