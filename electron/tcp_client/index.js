const EventEmitter = require('events');
import { Socket } from 'net';
class TCPClient extends EventEmitter {
    constructor() {
        super();
        this.client = null;
        this.addr = '';
        this.port = null;

        function onExit() {
            console.log('Exiting...');
            if (this.client && !this.client.destroyed) {
                this.client.destroy();
            }
            process.exit(0);
        }
        process.on('exit', onExit);
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
            //console.log('onReceiveData', buff);
            this.emit('data', { buff: buff });
        } catch (e) {
            this.bufList = [];
            this.totalLenth = 0;
            this.emit('error', { type: "TCP_CLIENT_ERROR", message: e.message });
        }
    }

    // init socket
    initConnToServer() {
        if (!this.client) {
            this.client = new Socket();
            this.client.on('data', (chunck) => {
                try {
                    this.onReceiveData(chunck);
                } catch (e) {
                    this.emit('error', { type: "TCP_CLIENT_ERROR", message: e.message });
                }
            });
            this.client.on('error', (err) => {
                this.emit('error', { type: 'TCP_CONNECTION_ERROR', message: `Connection error: ${err.message}. Attempting to reconnect!` });
                setTimeout(() => this.initConnToServer(), 2000);
            });
            if (!this.client.connecting) {
                this.client.connect(this.port, this.addr);
            }
        }

        if (this.client.destroyed) {
            this.client.connect(this.port, this.addr);
        }
    }

    connect() {
        if (!this.client || this.client.destroyed) {
            this.initConnToServer();
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

export {
    TCPClient
}