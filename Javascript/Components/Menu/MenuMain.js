import eventBus from '../../Utility/EventBus.js';

const appMenuMain = Vue.component('app-menu', {
    name: 'app-menu',
    template: `
        <div class="app-menu-container noselect">
            <div class="menu-item-top"></div>
            <div id="main-menu-items">
                <div v-for="(category, index) in categories" :key="category.Name" class="menu-item mmItem" :ref="index" :id="category.Name" @click="select(category.Name)">
                    {{category.Name}}
                </div>
            </div>
            <div class="menu-item-bottom"></div>
        </div>
    `,
    data() {
        return {
            data: []
        }
    },
    methods: {
        select(name) {
            document.querySelectorAll('.mmItem').forEach((item, index) => {
                if(item.id === name) { 
                    item.classList.add("menu-item-active");
                    this.$store.commit("setCategory", index);
                }
                else item.classList.remove("menu-item-active");
            });
            eventBus.$emit('showSubCategories');
        }
    },
    computed: {
        css: function() {
            return `
                <style>
                    .app-menu-container {
                        grid-area: menuMain;
                        height: 100%;
                        width: 250px;
                        display: grid;
                        grid-template-rows: 5vh max-content 1fr;
                        font-family: Raleway; 
                        font-size: 1.1em;
                        overflow-y: scroll;
                    }
                    .app-menu-container::-webkit-scrollbar {
                        width: 0;
                    }
                    .menu-item {
                        text-align: right;
                        padding-top: 5px;
                        padding-bottom: 5px;
                        padding-right: 15px;
                        border-right: 1px solid var(--border);
                    }
                    .menu-item-active {
                        border-right: none;
                        border-bottom: 1px solid var(--border);
                        border-top: 1px solid var(--border);
                        border-left: 1px solid var(--border);
                        padding-top: 4px;
                        padding-bottom: 4px;
                        padding-right: 16px;
                        margin-left: 20%;
                        border-top-left-radius: 0.3em;
                        border-bottom-left-radius: 0.3em;
                    }
                    .menu-item:hover {
                        cursor: pointer;
                        border-right: 2px solid var(--border-hover);
                        padding-right: 14px;
                    }
                    .menu-item-active:hover {
                        cursor: pointer;
                        border-right: none;
                        padding-right: 16px;

                    }
                    .menu-item-top, .menu-item-bottom {
                        border-right: 1px solid var(--border);
                    }
                </style>
            ` 
        },
        categories: function() { return this.$store.getters.getAllData },
        getCategoryData: function() { return this.$store.getters.categoryData; },
        getActiveCategory: function() { return this.$store.getters.getActiveCategory; }
    },
    mounted() {
        $('head').append(this.css);
    }
});


export default appMenuMain;