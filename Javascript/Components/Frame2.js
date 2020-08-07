import iconClose from './Icons/Close.js';
import iconMin from './Icons/Minimize.js';
import iconMax from './Icons/Maximize.js';

const appFrame = Vue.component('app-frame-alt', {
    name: 'app-frame-alt',
    components: {
        iconClose,
        iconMin,
        iconMax
    },
    template: `
        <header>
            <div class="logo"></div>
            <icon-min @click.native="minimize"></icon-min>
            <icon-max @click.native="maximize"></icon-max>
            <icon-close @click.native="close"></icon-close>
        </header>
    `,
    methods: {
        minimize() { window.API.send("minimize"); },
        maximize() { window.API.send("maximize"); },
        close() { window.API.send("close"); }
    },
    computed: {
        css: function() {
            return `
                <style>
                    header {
                        height: 20px;
                        display: grid;
                        grid-template-columns: 1fr max-content max-content max-content;
                        color: #fff;
                    }
                    .logo {
                        background-color: var(--frame-background);
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        padding-left: 1vh;
                        -webkit-app-region: drag;
                        font-size: 1.1em;
                        margin: 0;
                    }
                    .frame-icon-container {
                        background-color: var(--frame-background);
                        height: 20px;
                        width: 25px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                    }
                    .frame-icon-container:hover {
                        cursor: pointer;
                        background-color: var(--frame-icon-hover);
                    }
                    .frame-icon-container svg {
                        color: var(--frame-icon-color);
                        margin: auto;
                        padding: 0.2em;
                    }
                </style>
            ` 
        }
    },
    mounted() {
        $('head').append(this.css);
    }
});


export default appFrame;