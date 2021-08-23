const { app, BrowserWindow } = require('electron')

function startIMYS() {
    const window = new BrowserWindow({width: 1370, height: 900, webPreferences: {backgroundThrottling: false}})
    window.loadURL('https://www.johren.games/games/imys-r-zh-tw/play/')
}

app.on("ready", startIMYS)