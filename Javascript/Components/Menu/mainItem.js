const appMainItem = Vue.component('main-item', {
    name: 'main-item',
    components: {
    },
    template: `
        <div class="menu-item" name="{{name}}" @click="select(name)">
            {{name}}
        </div>
    `,
    props: {
        name
    },
    computed: {
        css: function() {
            return `
                <style>
                    .app-menu-container {
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
                    }
                    .menu-item:hover {
                        cursor: pointer;
                        border-right: 3px solid var(--border-hover);
                        padding-right: 13px;
                    }
                    .menu-item-top, .menu-item-bottom {
                        border-right: 1px solid var(--border);
                    }
                </style>
            ` 
        }
    },
    mounted() {
        $('head').append(this.css);
    }
});


export default appMainItem;