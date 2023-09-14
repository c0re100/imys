const {app, BrowserWindow, webFrameMain, clipboard, session } = require('electron')
const path = require("path")
const menu = require('./menu')
const proxy = require('./proxy')

app.setAppUserModelId('imys_r')

if (process.execPath.match(/imys.exe/)) {
    currPath = path.dirname(process.execPath)
    let p = path.join(currPath, 'userdata')
    app.setPath('userData', p)
} else {
    let p = path.join(__dirname, 'userdata')
    app.setPath('userData', p)
}

let debug = false

app.commandLine.appendSwitch('ignore-certificate-errors', 'true')
if (debug) {
    app.commandLine.appendSwitch('proxy-server', '127.0.0.1:5678')
} else {
    app.commandLine.appendSwitch('proxy-server', '127.0.0.1:8765')
}

proxy.SetDebugMode(debug)
proxy.startMITM()

async function startIMYS() {
    const imysWindow = new BrowserWindow({
        width: 1380,
        height: 900,
        webPreferences: {
            backgroundThrottling: false,
            contextIsolation: false,
            nodeIntegrationInSubFrames: true,
            preload: path.join(__dirname, 'unlocker.js'),
        }
    })
    menu.CustomMenu(imysWindow)

    const webRequest = imysWindow.webContents.session.webRequest
    const filter = {
        urls: ['https://rkyfxfex.aimia.dmmgames.com/abysshole/battle_skip?v=*']
    }

    webRequest.onBeforeSendHeaders(filter,
        (details, callback) => {
            if (menu.GetBlockSkip()) {
                callback({cancel: true})
            } else {
                callback({})
            }
        }
    )

    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';
        callback({ cancel: false, requestHeaders: details.requestHeaders });
    });

    await imysWindow.loadURL('https://games.dmm.co.jp/play/cloud')
}

app.on("ready", async () => startIMYS())

app.on("web-contents-created", (e, contents) => {
    menu.Create(contents)
})
