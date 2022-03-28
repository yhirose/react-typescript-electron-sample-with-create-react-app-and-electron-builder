import './App.css';
import logo from './logo.svg';
import React, { useEffect, useState } from 'react';

const HOST = "127.0.0.1";
const PORT = 9090;

function App() {
  const [sendBbuffer, setSendBuffer] = useState<string>("")
  const [recvBuffer, setRecvBuffer] = useState<string>("")

  const connect = () => {
    window.backendAPI.connect(HOST, PORT);
    window.backendAPI.sendData('Client Connected' + '\n');
  }

  useEffect(() => {
    connect();
    window.backendAPI.onDataReceived(data => {
      setRecvBuffer(data.buff?.data.toString('utf8'));
    });
  }, []);

  const sendData = () => {
    window.backendAPI.sendData(sendBbuffer + '\n');
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Send Message to Backend (TCP):
        </p>
        <input type="text" value={sendBbuffer} onChange={(e) => setSendBuffer(e.target.value)} />
        <button onClick={sendData}>Send</button>
        <p>
          Received Message from Backend (TCP):
        </p>
        <input type="text" value={recvBuffer} readOnly />
      </header>
    </div>
  );
}

export default App;
