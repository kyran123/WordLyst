import subHeader from '../Components/subHeader.js';
import appMenu from '../Components/Menu/MenuMain.js';
import appMenuSub from '../Components/Menu/MenuSub.js';
import contentSimple from '../Components/Content/ContentSimple.js';
import contentTable from '../Components/Content/ContentTable.js';
import contentSentences from '../Components/Content/ContentSentences.js';
import worldDetailsOverlay from './Overlay/WordDetailOverlay.js';
import settingsScreen from './SettingsScreen.js';

import eventBus from '../Utility/EventBus.js';

const appContent = Vue.component('app-content', {
    name: 'app-content',
    components: {
        subHeader,
        appMenu,
        appMenuSub,
        contentSimple,
        contentTable,
        contentSentences,
        worldDetailsOverlay,
        settingsScreen
    },
    template: `
        <div class="app-content-container">
            <sub-header></sub-header>
            <app-menu></app-menu>
            <app-sub-menu v-show="showSubMenu"></app-sub-menu>
            <content-simple v-show="contentType === 'Simple'"></content-simple>
            <content-table v-show="contentType === 'Table'"></content-table>
            <content-sentences v-show="contentType === 'Sentences'"></content-sentences>
            <word-details-overlay></word-details-overlay>
            <settings-screen v-show="showSettings"></settings-screen>
        </div>
    `,
    data() {
        return {
            subCategories: [],
            showSubMenu: false,
            contentType: "",
            showSettings: false  
        }
    },
    methods: {
        showContent() {
            if(data != null) this.subCategories = this.getCategoryData[this.getActiveCategory].Categories;
        },
        contentView() {
            this.contentType = this.getCategoryData[this.getActiveCategory].Type;
            eventBus.$emit('showData', this.contentType);
        }
    },
    computed: {
        css: function() {
            return `
                <style>
                    .app-content-container {
                        width: 100vw;
                        height: calc(100vh - 20px);
                        top: 20px;
                        display: grid;
                        grid-template-areas: 'subHeader subHeader subHeader' 'menuMain menuSub content';
                        grid-template-rows: 50px 1fr;
                        grid-template-columns: max-content max-content 1fr;
                        overflow: hidden;
                        background-color: var(--background-color);
                        color: var(--color-alt);
                    }
                </style>
            ` 
        },
        getCategoryData: function() { return this.$store.getters.categoryData; },
        getActiveCategory: function() { return this.$store.getters.getActiveCategory; }
    },
    mounted() {
        $('head').append(this.css);
        eventBus.$on('showSubCategories', () => { this.showSubMenu = true; });
        eventBus.$on('showContentData', () => { this.contentView(); });
        eventBus.$on('showSettings', () => { this.showSettings = true; eventBus.$emit("hideOverlay"); });
        eventBus.$on('closeSettings', () => { this.showSettings = false; });
    },
    watch: {
        getActiveCategory: function() { this.showContent; }
    }
});


export default appContent;