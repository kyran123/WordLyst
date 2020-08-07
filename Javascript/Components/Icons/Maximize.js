const maxIcon = Vue.component('icon-maximize', {
    name: 'icon-minimize',
    template: `
        <div class="frame-icon-container">
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                shape-rendering="crispEdges"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M17 7H7V17H17V7ZM4 4V20H20V4H4Z"
                    fill="currentColor"
                />
            </svg>
        </div>
    `,
    mounted() {
        $('head').append(this.css);
    }
});


export default maxIcon;