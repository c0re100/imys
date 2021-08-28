const {app, BrowserWindow, webFrameMain, clipboard} = require('electron')
const contextMenu = require('electron-context-menu');
const path = require("path");
const nativeImage = require('electron').nativeImage

contextMenu({
    prepend: (defaultActions, parameters, browserWindow) => [
        {
            label: 'Copy image',
            visible: parameters.mediaType === 'canvas',
            click: (menuItem, browserWindow, event) => {
                browserWindow.webContents.mainFrame.framesInSubtree.filter((frame) => {
                    if (frame.url === 'https://johren-r18.irismystery.com/pc/iframe') {
                        frame.executeJavaScript(`
                            function takeScreenshot() {
                                let canvas = document.querySelector('#unity-canvas');
                                return canvas.toDataURL()
                            }
                            takeScreenshot()
                        `).then((result) => {
                            let b64 = nativeImage.createFromDataURL(result)
                            clipboard.writeImage(b64)
                        })
                    }
                })
            }
        },
        {
            label: 'Save image',
            visible: parameters.mediaType === 'canvas',
            click: (menuItem, browserWindow, event) => {
                browserWindow.webContents.mainFrame.framesInSubtree.filter((frame) => {
                    if (frame.url === 'https://johren-r18.irismystery.com/pc/iframe') {
                        frame.executeJavaScript(`
                            function saveImage() {
                                let canvas = document.querySelector('#unity-canvas');
                                canvas.toBlob((blob) => {
                                  const a = document.createElement('a');
                                  a.download = 'imys_screenshot_' + new Date().toLocaleString("en-CA", {hour12: false, timeZone: "Asia/Hong_Kong"}).
                                        replace(/-/g, '_').
                                        replace(/, /g, '_').
                                        replace(/:/g, '_') + '.jpg';
                                  a.href = URL.createObjectURL(blob);
                                  document.body.appendChild(a);
                                  a.click();
                                  document.body.removeChild(a);
                                });
                            }
                            saveImage()
                        `)
                    }
                })
            }
        }
    ]
});

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
