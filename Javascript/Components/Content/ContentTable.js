import eventBus from '../../Utility/EventBus.js';

const appContentTable = Vue.component('content-table', {
    name: 'content-table',
    components: {
        
    },
    template: `
        <div class="data-table-container">
            <table>
                <tr>
                    <th>Category</th>
                    <th>Word</th>
                    <th>Synonyms</th>
                </tr>
                <template v-for="(category, contentIndex) in content" :key="category.Name+contentIndex">
                    <tr v-for="(word, wordIndex) in category.Words" :key="word.Name+wordIndex">
                        <td :rowspan="category.Words.length" v-if="wordIndex === 0"><a @click="showDefinition(category.Name)"><b>{{category.Name}}</b></a></td>
                        <td><a @click="showDefinition(word.Name)">{{word.Name}}</a></td>
                        <td>
                            <a v-for="(synonym, synonymIndex) in word.Synonyms" :key="synonym+synonymIndex" v-if="word.Synonyms.length > 0" @click="showDefinition(synonym)">
                                {{synonym}}
                                <template v-if="word.Synonyms.length > synonymIndex+1">, </template>
                            </a>
                        </td>
                    </tr>
                </template>
            </table>
        </div>
    `,
    data() {
        return {
            content: []
        }
    },
    methods: {
        updateData() {
            console.log(this.getAllData[this.getActiveCategory].Categories[this.getSubCategory].Subcategories);
            if(this.getAllData != null) this.content = this.getAllData[this.getActiveCategory].Categories[this.getSubCategory].Subcategories;
        },
        setupTableData() {
            const data = [];
            this.content.forEach((category) => {
                category.Words.forEach((word) => {
                    data.push(word);
                })
            });
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
                    .data-table-container {
                        margin: 5vh;
                        overflow-y: scroll !important;
                    }
                    table {
                        text-align: left;
                        border-collapse: collapse;
                        width: 100%;
                    }
                    tr {
                        border-bottom: 1px solid #ccc;
                    }
                    th {
                        color: var(--table-header-color);
                    }
                    td {
                        padding: 1vh;
                    }
                    td a:hover {
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
        eventBus.$on('showData', (type) => { if(type === "Table") this.updateData(); });
    }
});


export default appContentTable;