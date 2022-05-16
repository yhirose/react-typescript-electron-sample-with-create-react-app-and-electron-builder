import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
const { TCPClient } = require(path.join(__dirname, '/tcp_client/index.js'));

const ClientHandlers = new TCPClient()

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadURL(path.join(__dirname, 'preload.js'))

  if (app.isPackaged) {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html`);
  } else {
    win.loadURL('http://localhost:3000/index.html');

    win.webContents.openDevTools();

    // Hot Reloading on 'node_modules/.bin/electronPath'
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname,
        '..',
        '..',
        'node_modules',
        '.bin',
        'electron' + (process.platform === "win32" ? ".cmd" : "")),
      forceHardReset: true,
      hardResetMethod: 'exit'
    });
  }

  ClientHandlers.on('data', (data: any) => {
    //console.log(data);
    win.webContents.send('DATA_RECEIVED', data);
  });

  ClientHandlers.on('error', (error: any) => {
    console.log(error);
    win.webContents.send('ERROR_RECEIVED', error);
  });
}

app.whenReady().then(() => {
  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
  
  ipcMain.on('SEND_DATA', (e, payload) => {
    ClientHandlers.sendToServer(payload);
  });

  ipcMain.on('CONNECT_TO_SERVER', (e, payload) => {
    ClientHandlers.setupClient(payload.host, payload.port);
  });

});
