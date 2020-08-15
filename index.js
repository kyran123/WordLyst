//Require the electron important things
const { app, BrowserWindow, globalShortcut, remote, electron } = require('electron');
const ipcMain = require('electron').ipcMain;
const unhandled = require('electron-unhandled');
 
unhandled();

//Libraries
let path;
let screen;

//Controllers
let ipcWrapper;

// Keep a global reference of the window objects, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let loadingWindow;
let mainWindow;

//Loading window 
function loadProgram() {
	//Require path to get the preload file, which requires a absolute path
	path = require('path');
	//Calculate size of width and height
	screen = require('electron').screen.getPrimaryDisplay();
	//This window is shown as the program does some work to setup and load
	loadingWindow = new BrowserWindow({
		width: (screen.bounds.width / 3),
		height: (screen.bounds.height / 3),
		frame: false,
		fullscreenable: false,
		resizable: false,
		show: true,
		backgroundColor: '#2484C1',
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			enableRemoteModule: false,
			preload: path.join(__dirname, '/Javascript/Utility/preload.js')
		}
	});
	loadingWindow.loadFile("Views/load.html");
	loadingWindow.on('closed', () => { loadingWindow = null; });
	//When program is ready and loaded
	loadingWindow.webContents.once('dom-ready', () => {
		//loadingWindow.webContents.openDevTools({ mode: "detach" });	
		//Call the load program requirements
		loadProgramRequirements();
		showMainProgram();
	});
}

function showMainProgram() {
	ipcWrapper.increaseProgress(5);
	mainWindow = new BrowserWindow({
		width: (screen.bounds.width / 2),
		height: (screen.bounds.height / 2),
		frame: false,
		show: false,
		fullscreenable: true,
		resizable: true,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			enableRemoteModule: false,
			preload: path.join(__dirname, '/Javascript/Utility/preload.js')
		}
	});
	mainWindow.loadFile("Views/main.html");
	ipcWrapper.increaseProgress(15);
	mainWindow.on('closed', () => { mainWindow = null; });
	//When program is ready and loaded
	mainWindow.webContents.once('dom-ready', () => {
		//If is in development
		//Show dev tools
		mainWindow.webContents.openDevTools({ mode: "detach" });
		ipcWrapper.increaseProgress(20);	
	});
	mainWindow.on('resize', () => {
		const appSize = mainWindow.getBounds();
		if(appSize.width < ((screen.bounds.width / 3) + 5)) {
			//is vertical layout (e.g. phones)
			mainWindow.webContents.send("vertical");
		}
		else if(appSize.width < ((screen.bounds.width / 1.5) + 5)) {
			//Only vertical layout of match container
			mainWindow.webContents.send("compact");
		}
		else {
			//normal layout
			mainWindow.webContents.send("normal");
		}
	});
}

//Require all the libraries here.
//Do it here because the browser window for the loading screen has been shown to the user now
//So the whole program loading part seems seemless instead of it taking a while to actually launch
function loadProgramRequirements() {
	//Setup IPC communication class
	ipcWrapper = require('./Javascript/Utility/IpcWrapper.js');
	ipcWrapper.increaseProgress(15);
	//Start actually loading libraries and what not
	//Require all libraries here

	//Get local app root
	global.appRoot = path.resolve(__dirname);
	global.apiLink = 'https://kylefransen.link';
	ipcWrapper.increaseProgress(15);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', loadProgram)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null) {
		loadProgram()
	}
});

ipcMain.on("showMainScreen", (event) => {
	if(loadingWindow != null) {
		loadingWindow.close();
	}
	if(mainWindow.show)
	mainWindow.show();
});