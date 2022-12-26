const contextMenu = require("electron-context-menu");
const {nativeImage, clipboard, Menu} = require("electron");

function Create(contents) {
    contextMenu({
        window: contents,
        showInspectElement: true,
        prepend: (defaultActions, parameters, browserWindow) => [
            {
                label: 'Copy image',
                visible: parameters.mediaType === 'canvas',
                click: (menuItem, browserWindow, event) => {
                    browserWindow.webContents.mainFrame.framesInSubtree.filter((frame) => {
                        if (frame.url === 'https://rkyfxfex.aimia.dmmgames.com/pc/iframe') {
                            frame.executeJavaScript(`
                            function takeScreenshot() {
                                let canvas = document.querySelector('#unity-canvas');
                                return canvas.toDataURL("image/png")
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
                        if (frame.url === 'https://rkyfxfex.aimia.dmmgames.com/pc/iframe') {
                            frame.executeJavaScript(`
                            function saveImage() {
                                let canvas = document.querySelector('#unity-canvas');
                                canvas.toBlob((blob) => {
                                  const a = document.createElement('a');
                                  a.download = 'imys_screenshot_' + new Date().toLocaleString("en-CA", {hour12: false, timeZone: "Asia/Hong_Kong"}).
                                        replace(/-/g, '_').
                                        replace(/, /g, '_').
                                        replace(/:/g, '_') + '.png';
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
}

let gameWindow = null
let blockSkip = true

let Template = [
    {
        label: "File",
        submenu: [
            {
                role: 'quit',
                label: "Exit",
            }
        ]
    },
    {
        label: "View",
        submenu: [
            {
                role: "reload",
                label: 'Reload'
            },
            {
                role: "forceReload",
                label: 'Force Reload'
            },
            {
                role: "toggleDevTools",
                label: 'Toggle Developer Tools'
            }
        ]
    },
    {
        label: "Tools",
        submenu: [
            {
                label: 'Block abysshole skip ✔️',
                click: function () {
                    blockSkip = !blockSkip;
                    RefreshCustomMenuLabel()
                }
            }
        ]
    }
]

function RefreshCustomMenuLabel() {
    // Block skip
    if (blockSkip) {
        Template[2].submenu[0].label = 'Block abysshole skip ✔️'
    } else {
        Template[2].submenu[0].label = 'Block abysshole skip ❌'
    }

    let menu = Menu.buildFromTemplate(Template);
    Menu.setApplicationMenu(menu);
}

function CustomMenu(mainWindow) {
    gameWindow = mainWindow

    let menu = Menu.buildFromTemplate(Template)
    Menu.setApplicationMenu(menu)
}

function GetBlockSkip() {
    return blockSkip
}

module.exports = {Create, CustomMenu, GetBlockSkip}
