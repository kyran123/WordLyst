const fs = require('fs');
const jsonFile = require('jsonfile');
const readdirp = require('readdirp');
const Store = require('electron-store');
const settings = new Store();
const axios = require('axios');
const moment = require('moment');

//-----------------//
// Todos:          //
//-----------------//
// 1. Check if file was deleted (in case of a manual remove)

class fileReader {
    //---------------------------------------------------------------------------//
    // First time setup                                                          //
    //---------------------------------------------------------------------------//
    constructor() {
        //First time setup
        if(settings.has('setup-file-reader')) return;
        settings.set('data-version-check', moment.utc().format('x'));
        settings.set('setup-file-reader', false);
    }
    //---------------------------------------------------------------------------//
    // Get the word data                                                         //
    //---------------------------------------------------------------------------//
    getWordData(callback) {
        //Get today's date
        let now = moment();
        let checkMoment;
        //Check if version has been recently been checked
        checkMoment = moment.utc(parseInt(settings.get('data-version-check')));
        //Compare date
        if(checkMoment.diff(now, 'days', true) < 0) {
            settings.set('data-version-check', moment.utc().add(30, 'd').format('x'));
            //Check if up to date
            this.isUpToDate((result) => {
                if(result) {
                    //Is up to date
                    this.getDataFromFile((data) => {
                        callback(data);
                    });
                } else {
                    //Is not up to date
                    this.getDataFromAPI((data) => {
                        //Write data
                        jsonFile.writeFile(`${appRoot}/Assets/Words/tmp.json`, data)
                        .then((result) => {
                            //Return data
                            callback(data);
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                    });
                }
            });
        } else {
            this.getDataFromFile((data) => {
                callback(data);
            });
        }
    }
    //---------------------------------------------------------------------------//
    // Check if version is up to date                                            //
    //---------------------------------------------------------------------------//
    isUpToDate(callback) {
        // 1) Check if we have already the updated version
        let currentVersion;
        // 1a) get local version
        if(settings.has('data-version')) currentVersion = settings.get('data-version');
        // 1b) get version from api (if possible)
        axios.get(`${process.env.API_LINK}/atlas/version`)
        .then((response) => {
            const version = response.data.version;
            // 1c) compare the two versions
            if(version === currentVersion) {
                //When the version is equal
                callback(true);
            } else {
                settings.set('data-version', version);
                //When there is a new update
                callback(false);
            }
        })
        .catch((err) => {
            console.error(err);
        });
    }
    //---------------------------------------------------------------------------//
    // Get the data from the API                                                 //
    //---------------------------------------------------------------------------//
    getDataFromAPI(callback) {
        axios.get(`${process.env.API_LINK}/atlas`)
        .then((response) => {
            callback(response.data);
        })
        .catch((err) => {
            console.error(err);
        });
    }
    //---------------------------------------------------------------------------//
    // get data from the locally stored file                                     //
    //---------------------------------------------------------------------------//
    getDataFromFile(callback) {
        callback(jsonFile.readFileSync(`${appRoot}/Assets/Words/tmp.json`));
    }
    //---------------------------------------------------------------------------//
    // go through all files stored locally                                       //
    // These are the development files for the data                              //
    //---------------------------------------------------------------------------//
    getFilesFromDir(dir, callback) {
        this.wordData = [];
        readdirp(dir, {fileFilter: '*.json'})
        .on('data', (entry) => {
            const { path } = entry;
            this.wordData.push(jsonFile.readFileSync(dir + '\\' + path));
        })
        .on('end', () => {
            callback(this.wordData);
        });
    }

}


module.exports = new fileReader();