import eventBus from '../../Utility/EventBus.js';

const appContentTable = Vue.component('content-complex', {
    name: 'content-complex',
    components: {
        
    },
    template: `
        <div class="content-complex-container">
            <div v-if="type === 'Simple'">
                <ul>
                    <li v-for="(word, index) in content.Words" :key="index">
                        <a @click="showDefinition(word)">{{word}}</a>
                    </li>
                </ul>
            </div>
            <div v-if="type === 'List-Simple'" class="list-simple">
                <ul>
                    <template v-for="(category, index) in content.List">
                        <li class="table-simple-category">
                            {{category.Name}}
                        </li>
                        <li v-for="(word, index) in category.Words" :key="word+index">
                            <a @click="showDefinition(word)">{{word}}</a>
                        </li>
                    </template>
                </ul>
            </div>
            <div v-if="type === 'Table-Simple'" class="table-simple">
                <table>
                    <tr>
                        <th style="width:250px">Replace</th><th>With this</th>
                    </tr>
                    <tr v-for="(category, index) in content.List">
                        <td class="table-simple-category">
                            <a @click="showDefinition(word)">{{category.Name}}</a>
                        </td>
                        <td>
                            <template v-for="(word, wordIndex) in category.Words">
                                <a @click="showDefinition(word)">{{word}}</a><span v-if="wordIndex < category.Words.length-1">, </span>
                            </template>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    `,
    data() {
        return {
            content: [],
            type: ""
        }
    },
    methods: {
        updateData() {
            if(this.getAllData != null) { 
                this.content = this.getAllData[this.getActiveCategory].Categories[this.getSubCategory];
                this.type = this.getAllData[this.getActiveCategory].Categories[this.getSubCategory].Type;
                console.log(this.content);
            }
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
                    .table-simple-category {
                        background-color: #333;
                        border-bottom: 1px solid #777;
                        color: #fff;
                    }
                    .content-complex-container {
                        overflow: hidden;
                        height: calc(100vh - 15vh);
                    }
                    .table-simple {
                        margin: 5vh;
                        height: 100%;
                        overflow-y: scroll;
                    }
                    .table-simple-category ul {
                        margin: 0 !important;
                    }
                </style>
            ` 
        },
        getCategoryData: function() { return this.$store.getters.categoryData; },
        getActiveCategory: function() { return this.$store.getters.getActiveCategory; },
        getAllData: function() { return this.$store.getters.getAllData },
        getSubCategory: function() { return this.$store.getters.getSubCategory; },
        getActiveCategory: function() { return this.$store.getters.getActiveCategory; },
    },
    mounted() {
        $('head').append(this.css);
        eventBus.$on('showData', (type) => { if(type === "Complex") this.updateData(); });
    }
});


export default appContentTable;