const EventEmitter = require('events');
const fork = require('child_process').fork;

// set tcp things into an individual process.
const tcpProcess = fork('./electron/tcp_client/client.js');

const SEND_DATA = 'SEND_DATA';
const SETUP_CLIENT = 'SETUP_CLIENT';
const events = new EventEmitter();


function onExit() {
    tcpProcess.kill('SIGINT');
    process.exit(0);
}

process.on('exit', onExit);

tcpProcess.on('message', (res) => {
    // add your own handlers
    console.log(res); // eslint-disable-line no-console
    try {
        switch (res.type) {
            case 'MESSAGE_FROM_SERVER':
                {
                    events.emit('data', res.payload);
                    break;
                }
            default:
                throw new Error('Unrecognized message received by tcp server');
        }
    } catch (e) {
        console.log(e); // eslint-disable-line no-console
    }
});

module.exports = {
    events,
    // init tcp client
    setupClient: (addr, port) => {
        tcpProcess.send({ type: SETUP_CLIENT, payload: { addr, port } });
    },
    // Connect to server
    connect: () => {
        tcpProcess.send({ type: CONNECT, payload: 'connect' });
    },
    // send string or buffer to server
    sendDataToServer: (data) => {
        tcpProcess.send({ type: SEND_DATA, payload: data });
    },
};