console.log('main process working');

const electron  = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");
const dialog = electron.dialog;
const ipc = electron.ipcMain;
let win;
const debug = true;

function createWindow() {
    win = new BrowserWindow({
        fullscreen :true,
        width: 1200,
        height: 1200,
        transparent: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    // win.webContents.openDevTools();
    win.setIgnoreMouseEvents(true , {forward:true});
    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    win.setAlwaysOnTop(true, 'screen-saver', 1); 
    win.loadURL(url.format({
        pathname : path.join(__dirname, 'index.html'),
        protocol : 'file',
        slashes : true
    }));
    win.on('close', ()=>{
        win = null;
    })
}

app.on('ready', () =>{
    createWindow();
});

app.on("window-all-closed", () =>{
    if(process.platform !== "darwin"){
        app.quit()
    }
})


// handle mouse hover over 
ipc.on('hover-on', function(event) {
    // if(!debug){
        win.setIgnoreMouseEvents(false , {forward:false});
        console.log('ON')
    // }
})
ipc.on('hover-off', function(event) {
    // if(!debug){
        win.setIgnoreMouseEvents(true , {forward:true});
        console.log('OFF');
    // }
})


// ===================================

app.on('activate', () =>{
    if( win === null){
        createWindow();
    }
});