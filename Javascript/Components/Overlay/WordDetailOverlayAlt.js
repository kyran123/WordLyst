import eventBus from '../../Utility/EventBus.js';

const worldDetailsOverlay = Vue.component('word-details-overlay', {
    name: 'word-details-overlay',
    components: {
    },
    template: `
        <div class="word-details-container" v-show="show">
            <div class="word-details-header">
                <h3>{{data.word}}</h3>
                <svg
                    @click="closeOverlay"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    shape-rendering="crispEdges"
                    fill="none"
                    stroke="#fff"
                    shape-rendering="crispEdges"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
                        fill="currentColor"
                    />
                </svg>
            </div>
            <div class="word-definitions-container">
                <div v-for="(definition, index) in data.data" :key="index" class="definition-container" v-if="showDefinition">
                    <div class="definition-nr noselect">{{index}}.</div>
                    <div class="definition-data">
                        <div class="definition-type">{{definition.word}} <i>{{definition.type}}</i></div>
                        <div class="definition-gloss">{{definition.description}}</div>
                        <div class="definition-usage" v-if="definition.usage.length > 0">
                            <div class="usage-title"><b>Usage:</b></div>
                            <div v-for="(usage, usageIndex) in definition.usage" :key="usage+usageIndex" class="usage-container"  v-html="usage">
                                - {{usage}}
                            </div>
                        </div>
                        <div class="definition-synonyms"  v-if="definition.synonyms.length > 0">
                            <div class="definition-title"><b>Synonyms:</b></div>
                            <div v-for="(synonym, index) in definition.synonyms" :key="synonym+index" class="definition-synonym">
                                - <a @click="showSynonymDefinition(synonym)">{{synonym}}</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="showSuggestions" class="suggestions-container">
                    <div class="noResults">    
                        <i>No results found. <br/> Did you mean any of these?</i>
                    </div>
                    <div v-for="(suggestion, suggestionIndex) in data.potentialWords.suggestions" :key="suggestion+suggestionIndex" class="suggestion-item">
                         - <a @click="showSynonymDefinition(suggestion.word)">{{suggestion.word}}</a>
                    </div>
                </div>
            </div>

        </div>
    `,
    data() {
        return {
            show: false,
            showDefinition: false,
            showSuggestions: false,
            activeIndex: 0,
            data: []
        }
    },
    methods: {
        closeOverlay() {
            this.show = false;
        },
        showSynonymDefinition(word) {
            window.API.send("getDefinition", word);
        },
        changeIndex(i) {
            this.activeIndex = i;
        }
    },
    computed: {
        css: function() {
            return `
                <style>
                    .word-details-container {
                        position: fixed;
                        top: calc(20px + 50px);
                        right: 0;
                        width: 20vw;
                        height: calc(100% - 90px);
                        background: #f8f8f8;
                        color: var(--color);
                        margin: auto;
                        padding: 1em;
                        padding-right: 2px !important;
                        border-left: 1px solid var(--border-alt);
                        display: grid;
                        grid-template-rows: max-content 1fr;
                    }
                    .word-definitions-container {
                        overflow-y: scroll;
                        padding-right: 15px;
                    }
                    .word-details-header {
                        display: grid;
                        grid-template-columns: 1fr max-content;
                        padding-right: 15px;
                    }
                    .word-details-header svg { 
                        margin-top: 5px;
                    }
                    .word-details-header svg:hover {
                        fill: #000;
                        color: #000;
                        cursor: pointer;
                    }
                    .word-details-container h3 {
                        margin-top: 5px;
                        margin-left: 10px;  
                        color: var(--header-color); 
                        font-family: OpenSans;
                        font-weight: 100;
                    }
                    .definition-container {
                        display: grid;
                        grid-template-areas: 'nr definitionData';
                        grid-template-columns: max-content 1fr;
                        padding-top: 15px;
                        margin-bottom: 10px;
                        background: #fff;
                        box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
                    }
                    .definition-nr {
                        grid-area: nr;
                        color: #888;
                        font-size: 1em;
                        margin-top: 2px;
                    }
                    .definition-data {
                        margin-bottom: 15px;
                    }
                    .definition-type {   
                        color: var(--definition-color);    
                        font-size: 1.1em;  
                        margin-left: 5px;  
                        letter-spacing: 0.5px;  
                        margin-bottom: 5px;      
                    }
                    .definition-type i {
                        color: var(--definition-type-color);     
                        font-size: 0.9em; 
                    }
                    .definition-title {
                        font-size: 0.9em;
                        color: var(--definition-container-color);
                        margin-top: 15px;
                        margin-left: 15px;
                    }
                    .definition-synonym {
                        margin-left: 20px;
                    }
                    .definition-synonym a:hover {
                        cursor: pointer;
                        color: #2484C1;
                    }

                    .sentence-definitions-container {
                        overflow-y: scroll;
                    }
                    .multiple-definition-container {
                        display: grid;
                        grid-template-rows: max-content 1fr;
                        margin-bottom: 5px;
                        padding: 5px;
                        margin-top: 5px;
                        margin-right: 15px;
                    }
                    .multiple-definition-header {
                        font-size: 1.2em;  
                        padding-left: 15px;
                        background: #87B7D3;
                        border-top: 1px solid #999;
                        border-left: 1px solid #999;
                        border-right: 1px solid #999; 
                        border-top-left-radius: 0.3em;
                        border-top-right-radius: 0.3em;
                        color: #fff;
                    }
                    .multiple-definition-header:hover {
                        cursor: pointer;
                        background: #2484C1;
                    }
                    .multiple-definition-data {
                        padding-top: 5px;
                        padding-left: 15px;
                        padding-right: 15px;
                        padding-bottom: 5px;
                        border-left: 1px solid #999;
                        border-bottom: 1px solid #999;
                        border-right: 1px solid #999;
                        border-bottom-right-radius: 0.3em;
                        border-bottom-left-radius: 0.3em;
                    }
                    .noDef {
                        font-family: Comfortaa_Thin;
                        font-style: italic;
                    }
                    .usage-title {
                        font-size: 0.9em;
                        color: var(--definition-container-color);
                        margin-top: 15px;
                        font-family: OpenSans; 
                    }
                    .usage-container {
                        margin-left: 20px;
                    }
                    .suggestions-container {
                        padding-left: 10px;
                    }
                    .noResults {
                        margin-bottom: 15px;
                    }
                    .suggestion-item {
                        padding-left: 10px;
                    }
                </style>
            ` 
        },
        getAllData: function() { return this.$store.getters.getAllData },
        getSubCategory: function() { return this.$store.getters.getSubCategory; },
        getActiveCategory: function() { return this.$store.getters.getActiveCategory; }        
    },
    mounted() {
        $('head').append(this.css);
        eventBus.$on("showOverlay", (data) => {
            eventBus.$emit("closeSettings");
            this.show = true;
            if(data.isSuccessfull) {
                //Word data is found
                this.showDefinition = true;
                this.showSuggestions = false;
                this.data = data;
            } else {
                //Word suggestions
                this.showDefinition = false;
                this.showSuggestions = true;
                this.data = data;
            }
        });
        eventBus.$on("hideOverlay", () => { this.show = false; });
    }
});


export default worldDetailsOverlay;


