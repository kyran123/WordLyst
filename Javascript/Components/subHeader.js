import search from '../Components/Reusable/Search.js';
import settings from '../Components/Icons/Settings.js';

const subHeader = Vue.component('app-header-sub', {
    name: 'app-header-sub',
    components: {
        search,
        settings
    },
    template: `
        <div class="subHeader">
            <div></div>
            <search></search>
            <icon-settings></icon-settings>
        </div>
    `,
    methods: {

    },
    computed: {
        css: function() {
            return `
                <style>
                    .subHeader {
                        grid-area: subHeader;
                        height: 50px;
                        width: 100vw;
                        background-color: var(--sub-frame-background);
                        display: grid;
                        grid-template-columns: 1fr max-content max-content;
                    }
                </style>
            ` 
        }
    },
    mounted() {
        $('head').append(this.css);
    }
});


export default subHeader;