const electron = require('electron')
const {app, BrowserWindow, Menu, ipcMain} = electron
const chalk = require('chalk')
const fs = require("fs")
const connect = require('connect');
const serveStatic = require('serve-static');
const compression = require('compression')

const setupGolem = require('./setup_golem.js')
const createTray = require('./electron/tray_handler.js')
const ipcHandler = require('./electron/ipc_handler.js')

function isDevelopment() {
    return process.env.NODE_ENV === 'development'
}

const APP_NAME = isDevelopment() ? 'GOLEM GUI (development)' : 'GOLEM GUI'
const APP_WIDTH = 460
const APP_HEIGHT = 520
const PREVIEW_APP_WIDTH = 776
const PREVIEW_APP_HEIGHT = 600

let win
let previewWindow
let tray

/**
 * [onReady init function for electron]
 * @return
 */
function onReady() {
    if (isDevelopment()) {
        installDevExtensions()
    }
    setupGolem()
    createWindow()
    tray = createTray(win)

    ipcHandler(app, tray, win, createPreviewWindow, APP_WIDTH, APP_HEIGHT)
}

/**
 * [installDevExtensions installing development extensions]
 * @return  {[Object]}   [Promise]
 */
function installDevExtensions() {
    const installExtension = require('electron-devtools-installer').default
    const REACT_DEVELOPER_TOOLS = require('electron-devtools-installer').REACT_DEVELOPER_TOOLS
    const REDUX_DEVTOOLS = require('electron-devtools-installer').REDUX_DEVTOOLS

    console.log(chalk.blue(`Installing DevTools extensions...`));
    console.log()

    return new Promise((resolve, reject) => {
        installExtension(REACT_DEVELOPER_TOOLS)
            .then((name) => {
                console.log(`${chalk.green(`✓`)} ${name}`)
                console.log()
                resolve()
            })
            .catch((err) => {
                console.log(chalk.red(`An error occurred: ${err}`))
                console.log()
                reject()
            })
        installExtension(REDUX_DEVTOOLS)
            .then((name) => {
                console.log(`${chalk.green(`✓`)} ${name}`)
                console.log()
                resolve()
            })
            .catch((err) => {
                console.log(chalk.red(`An error occurred: ${err}`))
                console.log()
                reject()
            })
    })
}

/**
 * [createWindow Creating browserWindow with given options]
 * @return 
 */
function createWindow() {
    win = new BrowserWindow({
        title: APP_NAME,
        width: APP_WIDTH,
        height: APP_HEIGHT,
        //titleBarStyle: 'hidden-inset',
        frame: false,
        resizable: true,
        minWidth: APP_WIDTH,
        minHeight: APP_HEIGHT,
        maxWidth: APP_WIDTH,
        center: true,
        show: false,
        //backgroundColor: '#00789d',
        "webPreferences": {
            "webSecurity": false
        }
    })

    /*
        win.webContents.on('did-finish-load', function() {
            setTimeout(function() {
                win.show();
            }, 40);
        });
    */
    win.once('ready-to-show', () => {
        win.show()
    })

    if (isDevelopment()) {
        win.loadURL(`http://localhost:${process.env.PORT || 3002}/`)
    } else {
        // Load prod build
        let app = connect()
        app.use(compression())
        app.use(serveStatic(__dirname)).listen(3003, function() {
            win.loadURL(`http://localhost:${process.env.PORT || 3003}/`)
        });
    //win.loadURL(`file://${__dirname}/index.html`)
    }

    // Do not update window title after loading pages
    win.on('page-title-updated', (event) => event.preventDefault())

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', onReady)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('will-navigate', ev => {
    ev.preventDefault()
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})


function createPreviewWindow() {
    previewWindow = new BrowserWindow({
        title: APP_NAME,
        width: PREVIEW_APP_WIDTH,
        height: PREVIEW_APP_HEIGHT,
        //titleBarStyle: 'hidden-inset',
        frame: false,
        resizable: false,
        center: true,
        show: true,
        //backgroundColor: '#00789d',
        "webPreferences": {
            "webSecurity": false
        }
    })

    /*
        win.webContents.on('did-finish-load', function() {
            setTimeout(function() {
                win.show();
            }, 40);
        });
    */
    previewWindow.once('ready-to-show', () => {
        win.show()
    })

    if (isDevelopment()) {
        previewWindow.loadURL(`http://localhost:${process.env.PORT || 3002}/preview`)
    } else {
        previewWindow.loadURL(`http://localhost:${process.env.PORT || 3003}/preview`)
    //win.loadURL(`file://${__dirname}/index.html`)
    }
}