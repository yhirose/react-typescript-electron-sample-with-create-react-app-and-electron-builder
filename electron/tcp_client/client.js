const net = require('net');

const TCP_MESSAGE_FROM_SERVER = 'MESSAGE_FROM_SERVER';
class TCPClient {
    constructor() {
        this.client = null;
        this.addr = '';
        this.port = null;
    }

    // setup client
    setupClient(addr, port) {
            if (this.client && !this.client.destroyed) {
                this.client.destroy();
            }
            this.addr = addr;
            this.port = port;
        }
        // callback of receive data
    onReceiveData(buff) {
        try {
            process.send({ type: TCP_MESSAGE_FROM_SERVER, payload: { buff } })
        } catch (e) {
            this.bufList = [];
            this.totalLenth = 0;
            console.log(`Error on onReceiveData ${e.message}`); // eslint-disable-line no-console
        }
    }

    // init socket
    initConnToServer() {
        if (!this.client) {
            this.client = new net.Socket();
            this.client.on('data', (chunck) => {
                try {
                    this.onReceiveData(chunck);
                } catch (e) {
                    console.log('onDataError', e.message); // eslint-disable-line no-console
                }
            });
            if (!this.client.connecting) {
                this.client.connect(this.port, this.addr);
            }
        }

        if (this.client.destroyed) {
            this.client.connect(this.port, this.addr);
        }
    }

    sendToServer(requestObj) {
        if (!this.client || this.client.destroyed) {
            this.initConnToServer();
        }

        if (requestObj && requestObj.length > 0) {
            this.client.write(requestObj);
        }
    }
}

const tcpClient = new TCPClient();

process.on('message', (m) => {
    try {
        switch (m.type) {
            case 'SETUP_CLIENT':
                {
                    tcpClient.setupClient(m.payload.addr, m.payload.port);
                    break;
                }
            case 'CONNECT':
                {
                    if (!this.client || this.client.destroyed) {
                        this.initConnToServer();
                    }
                    break;
                }
            case 'SEND_DATA':
                {
                    if (!tcpClient.client || tcpClient.client.destroyed) {
                        tcpClient.initConnToServer();
                    }
                    tcpClient.sendToServer(m.payload);
                    break;
                }
            default:
                throw new Error('Unrecognized message received by tcp client');
        }
    } catch (e) {
        console.log(e); // eslint-disable-line no-console
    }
});