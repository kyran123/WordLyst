import eventBus from '../../Utility/EventBus.js';

const appContentSentences = Vue.component('content-sentences', {
    name: 'content-sentences',
    components: {
    },
    template: `
        <div>
            <ul>
                <li v-for="(sentence, index) in content" :key="index">
                    <a v-for="(word, wordIndex) in sentence" :key="wordIndex" @click="getDefinition(word)">{{word}} </a>
                </li>
            </ul>
        </div>
    `,
    data() {
        return {
             content: [],
             listenerSet: false  
        }
    },
    methods: {
        updateData() {
            if(this.getAllData != null) {
                this.content = [];
                const sentences = this.getAllData[this.getActiveCategory].Categories[this.getSubCategory].Sentences;
                sentences.forEach((sentence) => {
                    const filtered = sentence.replace(/[^\w\s]/gi, '');
                    this.content.push(filtered.split(" "));
                }); 
            }
        },
        getDefinition(word) {
            window.API.send("getDefinition", word);
            if(!this.listenerSet) {
                this.listenerSet = true;
                window.API.receive("showDefinition", (data) => {
                    eventBus.$emit("showOverlay", data);
                });
            }
        }
    },
    computed: {
        css: function() {
            return `
                <style>
                    ul {
                        margin: 5vh;
                        overflow-y: scroll;
                        height: calc(100vh - 15vh);
                    }
                    li {
                        font-family: OpenSans;
                        border-bottom: 1px solid #ddd;
                        list-style-type: none;
                        padding-left: 25px;
                        padding-top: 5px;
                        padding-bottom: 5px;
                    }
                    a:hover {
                        cursor: pointer;
                        color:  var(--color-hover);
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
        eventBus.$on('showData', (type) => { if(type === "Sentences") this.updateData(); });
    }
});


export default appContentSentences;