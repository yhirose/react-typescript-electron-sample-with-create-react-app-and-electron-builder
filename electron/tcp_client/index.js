const fork = require('child_process').fork;

// set tcp things into an individual process.
const tcpProcess = fork('./electron/tcp_client/client.js');

const SEND_DATA = 'SEND_DATA';
const SETUP_CLIENT = 'SETUP_CLIENT';


function onExit() {
    tcpProcess.kill('SIGINT');
    process.exit(0);
}

process.on('exit', onExit);

tcpProcess.on('message', (res) => {
    // add your own handlers
    console.log(res); // eslint-disable-line no-console
});

module.exports = {
    // init tcp client
    setupClient: (addr, port) => {
        tcpProcess.send({ type: SETUP_CLIENT, payload: { addr, port } });
    },
    // send string or buffer to server
    sendDataToServer: (data) => {
        tcpProcess.send({ type: SEND_DATA, payload: data });
    },
};