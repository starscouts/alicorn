const { app, BrowserWindow, screen, ipcMain } = require('electron')
const path = require('path')

require('@electron/remote/main').initialize()

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: process.argv.includes("0") ? screen.getPrimaryDisplay().size.width + 1 : 800,
        height: process.argv.includes("0") ? screen.getPrimaryDisplay().size.height + 1 : 600,
        fullscreen: process.argv.includes("0"),
        fullscreenable: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true,
            enableRemoteModule: true
        }
    })

    ipcMain.on('sdk-call', (event, message) => {
        mainWindow.send("sdk-call", message)
    })

    mainWindow.loadFile('index.html')
    mainWindow.setMenu(null);
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    app.quit()
})

app.on('web-contents-created', (_, webContents) => {
    require('@electron/remote/main').enable(webContents)
})
