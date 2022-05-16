const {app, BrowserWindow, webFrameMain, clipboard} = require('electron')
const path = require("path");
const menu = require('./menu')

app.commandLine.appendSwitch("enable-native-gpu-memory-buffers")
app.commandLine.appendSwitch("enable-gpu-memory-buffer-compositor-resources")

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

    await imysWindow.loadURL('https://www.johren.games/games/imys-r-zh-tw/play/')
}

app.on("ready", async () => startIMYS())

app.on("web-contents-created", (e, contents) => {
    menu.Create(contents)
})
