import eventBus from '../Utility/EventBus.js';

const settingsScreen = Vue.component('settings-screen', {
    name: 'settings-screen',
    components: {
    },
    template: `
        <div class="settings-screen-container">
            <div class="close-settings">
                <div></div>
                <svg
                    @click="closeSettings"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    shape-rendering="crispEdges"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
                        fill="currentColor"
                    />
                </svg>
            </div>

            <div class="menu-items-container">
                Dark mode
                <label class="switch">
                    <input type="checkbox" :checked="darkMode" @click="updateDarkMode(!darkMode)">
                    <span class="slider round"></span>
                </label>
            </div>
            <div class="menu-items-container">
                <button v-if="!waitingForResponse" @click="update">Search for updates</button>
                <div class="updateResponse" v-show="response.length > 2">{{response}}</div>
            </div>
        </div>
    `,
    data() {
        return {
            darkMode: false,
            waitingForResponse: false,
            waitingForResponseDelay: 0,
            response: ""
        }
    },
    methods: {
        updateDarkMode(value) {
            console.log("updating to: " + value);
            window.API.send("setDarkModeSetting", value);
            this.darkMode = value;
        },
        closeSettings() {
            eventBus.$emit('closeSettings');
        },
        update() {
            this.waitingForResponse = true;
            window.API.send("checkVersion");
        }
    },
    computed: {
        css: function() {
            return `
                <style>
                    .settings-screen-container {
                        position: fixed;
                        top: calc(20px + 50px);
                        right: 0;
                        width: 20vw;
                        height: calc(100% - 20px);
                        z-index: 100;
                        background: var(--background-color);
                        border-left: 1px solid var(--border);
                    }
                    .close-settings {
                        width: calc(100% - 30px);
                        padding: 15px;
                        margin-bottom: 10px;
                        display: grid;
                        grid-template-columns: 1fr max-content;
                    }
                    .close-settings svg {
                        float: right;
                    }
                    .close-settings svg:hover {
                        cursor: pointer;
                        color: #000;
                        fill: #000;
                    }
                    .menu-items-container {
                        text-align: center;
                        max-height: 30px;
                        line-height: 24px;
                        padding-top: 3px;
                        margin-bottom: 10px;
                    }
                    .menu-items-container button {
                        background-color: #fff;
                        border: 1px solid #555;
                        border-radius: 0.5em;
                        padding-top: 5px;
                        padding-bottom: 5px;
                        padding-left: 15px;
                        padding-right: 15px;
                    }
                    .menu-items-container button:hover {
                        cursor: pointer;
                        background-color: #eee;
                    }
                    .updateResponse {
                        font-style: italic;
                        color: #999;
                        margin-top: 5px;
                    }




                    /* The switch - the box around the slider */
                    .switch {
                    position: relative;
                    display: inline-block;
                    width: 45px;
                    height: 24px;
                    margin-left: 15px;
                    }

                    /* Hide default HTML checkbox */
                    .switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                    }

                    /* The slider */
                    .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    -webkit-transition: .4s;
                    transition: .4s;
                    }

                    .slider:before {
                    position: absolute;
                    content: "";
                    height: 17px;
                    width: 17px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    -webkit-transition: .4s;
                    transition: .4s;
                    }

                    input:checked + .slider {
                    background-color: #2484C1;
                    }

                    input:focus + .slider {
                    box-shadow: 0 0 1px #2484C1;
                    }

                    input:checked + .slider:before {
                    -webkit-transform: translateX(20px);
                    -ms-transform: translateX(20px);
                    transform: translateX(20px);
                    }

                    /* Rounded sliders */
                    .slider.round {
                    border-radius: 24px;
                    }

                    .slider.round:before {
                    border-radius: 50%;
                    }
                </style>
            ` 
        }
    },
    mounted() {
        $('head').append(this.css);
        eventBus.$on("updateSettings", (data) => {
            this.darkMode = data;
        });
        eventBus.$on("showVersionInfo", (status) => {
            this.response = status;
            setTimeout(() => {
                this.response = "";
                this.waitingForResponseDelay += 5000;
                this.waitingForResponse = false;
            }, (5000 + this.waitingForResponseDelay));
        })
    }
});


export default settingsScreen;