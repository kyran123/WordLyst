import iconClose from './Icons/Close.js';
import iconMin from './Icons/Minimize.js';
import iconMax from './Icons/Maximize.js';

const appFrame = Vue.component('app-frame', {
    name: 'app-frame',
    components: {
        iconClose,
        iconMin,
        iconMax
    },
    template: `
        <header>
            <div class="logo">TYPEPEDIA</div>
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
                        height: 30px;
                        display: grid;
                        grid-template-columns: 1fr max-content max-content max-content;
                        color: #fff;
                    }
                    .logo {
                        background-color: #2484C1;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        padding-left: 1vh;
                        -webkit-app-region: drag;
                        font-size: 1.1em;
                        margin: 0;
                    }
                    .frame-icon-container {
                        background-color: #2484C1;
                        height: 30px;
                        width: 40px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                    }
                    .frame-icon-container:hover {
                        cursor: pointer;
                        background-color: #1C5A9B;
                    }
                    .frame-icon-container svg {
                        margin: auto;
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