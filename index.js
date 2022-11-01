const {app, BrowserWindow, webFrameMain, clipboard} = require('electron')
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

app.commandLine.appendSwitch("enable-native-gpu-memory-buffers")
app.commandLine.appendSwitch("enable-gpu-memory-buffer-compositor-resources")
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
        urls: ['https://johren-r18.irismystery.com/abysshole/battle_skip?v=*']
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

    await imysWindow.loadURL('https://www.johren.games/games/imys-r-zh-tw/play/')
}

app.on("ready", async () => startIMYS())

app.on("web-contents-created", (e, contents) => {
    menu.Create(contents)
})
