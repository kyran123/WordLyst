const minIcon = Vue.component('icon-minimize', {
    name: 'icon-minimize',
    template: `
        <div class="frame-icon-container">
            <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            shape-rendering="crispEdges"
            xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M2 11H22V13H2V11Z" fill="currentColor" />
            </svg>
        </div>
    `,
    mounted() {
        $('head').append(this.css);
    }
});


export default minIcon;