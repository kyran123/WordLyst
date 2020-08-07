const WordPos = require('wordpos');
let wordPos = new WordPos({debug: true});
let spelling = require('spelling');
let dict = require('../../node_modules/spelling/dictionaries/en_US');
let dictionary = new spelling(dict);
const pluralize = require('pluralize');
const inflection = require('inflection');
const axios = require('axios');

class wordDefinition {
    getDefinition(word, callback) {
        wordPos.lookup(word, (definitions) => {
            let wordDefinitions = [];
            if(definitions.length > 0) {
                //Loop through results and adjust some of the values to be more readable for the user
                definitions.forEach((definition) => {
                    const t = definition.lexName.split(".")[0];
                    let type = "";
                    switch(t) {
                        case "adj": type = "Adjective"; break;
                        case "noun": type = "Noun"; break;
                        case "verb": type = "Verb"; break;
                    }
                    wordDefinitions.push({
                        word: definition.lemma,
                        type: type,
                        synonyms: definition.synonyms,
                        description: definition.def,
                        usage: definition.exp
                    });
                });
                //Results for this word found, return it to the view
                callback({ isSuccessfull: true, word: word, data: wordDefinitions });
            } else {
                /* THIS IS DEPRECATED: CANT STORE API KEY LOCALLY, SO NOW NEED TO ACCESS WritersAtlas API
                owlBot.define(word)
                .then((results) => {
                    results.definitions.forEach((definition) => {
                        let usage = [];
                        if(definition.example != null) usage.push(definition.example);
                        wordDefinitions.push({
                            word: results.word,
                            type: definition.type,
                            synonyms: [],
                            description: definition.definition,
                            usage: usage
                        });
                    });
                    //show similar words, that the user might have meant
                    callback({ isSuccessfull: true, word: word, data: wordDefinitions });
                })
                .catch((response) => {
                    callback({ isSuccessfull: false, word: word, potentialWords: dictionary.lookup(word) });
                });*/
                axios.get(`${apiLink}/atlas/def/${word}`)
                .then((results) => {
                    results.data.definitions.forEach((definition) => {
                        let usage = [];
                        if(definition.example != null) usage.push(definition.example);
                        wordDefinitions.push({
                            word: results.data.word,
                            type: definition.type,
                            synonyms: [],
                            description: definition.definition,
                            usage: usage
                        });
                    });
                    //show similar words, that the user might have meant
                    callback({ isSuccessfull: true, word: word, data: wordDefinitions });
                })
                .catch((response) => {
                    callback({ isSuccessfull: false, word: word, potentialWords: dictionary.lookup(word) });
                });
                console.groupEnd();
            }
        });
    }
    getDefinitions(words, callback) {
        let data = [];
        words.forEach((word, index) => {
            this.getDefinition(word, (result) => {
                if(result != null) data.push(result);
                if(index == (words.length - 1)) callback({ isSentence: true, results: data });
            });
        });
    }
    getSuggestions(word, callback) {
        callback({ suggestions: dictionary.lookup(word) });
    }
}


module.exports = new wordDefinition();