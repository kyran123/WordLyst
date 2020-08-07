const Store = require('electron-store');
const settings = new Store();

class userSettings {
    getDarkMode(callback) {
        if(!settings.has('darkMode')) {
            settings.set('darkMode', false);
        }
        callback(settings.get('darkMode'));
    }
    setDarkMode(value, callback) {
        settings.set('darkMode', value);
        callback(settings.get('darkMode'));
    }
}


module.exports = new userSettings();