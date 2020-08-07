const { app, BrowserWindow } = require('electron');
const ipcMain = require('electron').ipcMain;
const path = require('path');
const fileReader = require('./FileReader.js');
const wordDefinition = require('./WordDefinition.js');
const userSettings = require('./UserSettings.js');

class wrapper {
    constructor() {
        //Basic handling of browser window functionality
        //Quitting the application
        ipcMain.on("close", (event, data) => { app.quit(); });
        //Closing the focused window
        ipcMain.on("minimize", (event, data) => { BrowserWindow.getFocusedWindow().minimize(); });
        //Closing all windows
        ipcMain.on("maximize", (event, data) => { BrowserWindow.getFocusedWindow().maximize(); });

        ipcMain.on("getWords", (event) => {
            fileReader.getWordData((data) => {
                event.sender.send("showWords", data);
            });
        });

        ipcMain.on("checkVersion", (event) => {
            fileReader.isUpToDate((upToDate) => {
                console.log("Is up to date: " + upToDate);
                if(upToDate) {
                    event.sender.send("showVersionInfo", "Your program is up to date.");
                } else {
                    fileReader.getWordData((data) => {
                        event.sender.send("showWords", data);
                    });
                }
            });
        });

        ipcMain.on("getDefinition", (event, word) => {
            wordDefinition.getDefinition(word, (data) => {
                event.sender.send('showDefinition', data);
            });
        });

        ipcMain.on("getDefinitions", (event, words) => {
            wordDefinition.getDefinitions(words, (data) => {
                event.sender.send('showDefinition', data);
            });
        });

        ipcMain.on("getDefinitionFromDefinition", (event, word) => {
            wordDefinition.getDefinition(word, (data) => {
                event.sender.send('showDefinitionFromDefinition', data);
            });
        });

        ipcMain.on("getDarkModeSetting", (event) => {
            userSettings.getDarkMode((result) => {
                event.sender.send('returnDarkModeSetting', result);
            });
        });

        ipcMain.on("setDarkModeSetting", (event, value) => {
            userSettings.setDarkMode(value, (result) => {
                event.sender.send('returnDarkModeSetting', result);
            });
        });

        ipcMain.on("updateProgress", (event, value) => {
            this.increaseProgress(value);
        });
    }
    increaseProgress(progress = 1) { BrowserWindow.getFocusedWindow().webContents.send("progress", progress); }
}


module.exports = new wrapper();