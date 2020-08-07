import eventBus from '../../Utility/EventBus.js';

const appContentSimple = Vue.component('content-simple', {
    name: 'content-simple',
    components: {
    },
    template: `
        <div>
            <ul>
                <li v-for="(word, index) in content" :key="index">
                    <a @click="showDefinition(word)">{{word}}</a>
                </li>
            </ul>
        </div>
    `,
    data() {
        return {
             content: []    
        }
    },
    methods: {
        updateData() {
            if(this.getAllData != null) this.content = this.getAllData[this.getActiveCategory].Categories[this.getSubCategory].Words;
        },
        showDefinition(word) {
            window.API.send("getDefinition", word);
            window.API.receive("showDefinition", (data) => {
                eventBus.$emit("showOverlay", data);
            });
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
                    ul::-webkit-scrollbar {
                        width: 3px;
                    }
                    ul::-webkit-scrollbar-track {
                        background: #fff;
                    }
                    ul::-webkit-scrollbar-thumb {
                        background: #888;
                    }
                    ul::-webkit-scrollbar-thumb:hover {
                        background: #555;
                    }
                    li {
                        font-family: OpenSans;
                        border-bottom: 1px solid #ddd;
                        list-style-type: none;
                        padding-left: 25px;
                        padding-top: 5px;
                        padding-bottom: 5px;
                    }
                    li a:hover {
                        cursor: pointer;
                        color: var(--color-hover);
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
        eventBus.$on('showData', (type) => { if(type === "Simple") this.updateData(); });
    }
});


export default appContentSimple;