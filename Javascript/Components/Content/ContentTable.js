import eventBus from '../../Utility/EventBus.js';

const appContentTable = Vue.component('content-table', {
    name: 'content-table',
    components: {
        
    },
    template: `
        <div class="data-table-container">
            <table id="data-table" v-html="tableHTML" @click="showDefinition">

            </table>
        </div>
    `,
    data() {
        return {
            tableHTML: ``
        }
    },
    methods: {
        updateData() {
            let tableHTML = `<table>`;
            if(this.getAllData != null) {
                const data = this.getAllData[this.getActiveCategory].Categories[this.getSubCategory];

                let totalRows = 0;
                let categoryPos = 0;
                let subCategoryPos = 0;
                let subSubCategoryPos = 0;
                let subSubSubCategoryPos = 0;
                let categories = [];
                let subCategories = [];
                let subSubCategories = [];
                let subSubSubCategories = [];
                data.List.forEach((category) => {
                    let categoryCount = 0;

                    if(data.Levels > 1) {
                        category.List.forEach((subCategory) => {
                            let subCategoryCount = 0;

                            if(data.Levels > 2) {
                                subCategory.List.forEach((subSubCategory) => {
                                    let subSubCategoryCount = 0;

                                    if(data.Levels > 3) {
                                        subSubCategory.List.forEach((subSubSubCategory) => {
                                            let subSubSubCategoryCount = 0;

                                            subSubSubCategoryCount++;
                                            categoryCount++;
                                            subCategoryCount++;
                                            subSubCategoryCount++;
                                            let subSubSubName = "";
                                            if(typeof subSubSubCategory === 'string' || subSubSubCategory instanceof String) {
                                                subSubSubName = subSubSubCategory;
                                            } else {
                                                subSubSubName = subSubSubCategory.Name;
                                            }
                                            if(subSubSubCategories.length > 0) subSubSubCategoryPos += subSubSubCategories[subSubSubCategories.length-1].rowspan;
                                            subSubSubCategories.push({
                                                name: subSubSubName,
                                                pos: subSubSubCategoryPos,
                                                rowspan: 1
                                            });

                                        });

                                    } else {
                                        categoryCount++;
                                        subCategoryCount++;
                                        totalRows++;
                                    }

                                    let subSubName = "";
                                    if(typeof subSubCategory === 'string' || subSubCategory instanceof String) {
                                        subSubName = subSubCategory;
                                        subSubCategoryCount = 1;
                                    } else {
                                        subSubName = subSubCategory.Name;
                                        if(subSubCategories.length > 0) subSubCategoryPos += subSubCategories[subSubCategories.length-1].rowspan;
                                    }
                                    subSubCategories.push({
                                        name: subSubName,
                                        pos: subSubCategoryPos,
                                        rowspan: subSubCategoryCount
                                    });
                                    if(typeof subSubCategory === 'string' || subSubCategory instanceof String) {
                                        if(subSubCategories.length > 0) subSubCategoryPos += 1;
                                    }

                                });
                            } else {
                                categoryCount++;
                                totalRows++;
                            }
                            let subName = "";
                            if(typeof subCategory === 'string' || subCategory instanceof String) {
                                subName = subCategory;
                                subCategoryPos += 1;
                            } else {
                                subName = subCategory.Name;
                                if(subCategories.length > 0) subCategoryPos += subCategories[subCategories.length-1].rowspan;
                            }
                            subCategories.push({
                                name: subName,
                                pos: subCategoryPos,
                                rowspan: subCategoryCount
                            });

                        });
                    }
                    if(categories.length > 0) categoryPos += categories[categories.length-1].rowspan;
                    categories.push({
                        name: category.Name,
                        pos: categoryPos,
                        rowspan: categoryCount
                    });
                    totalRows += categoryCount;
                });
                
                let categoryIndex = 0;
                let subCategoryIndex = 0;
                let subSubCategoryIndex = 0;
                let subSubSubCategoryIndex = 0;


                //Add header to the table
                tableHTML += `<tr>`;
                for(let h = 0; h < data.Headers.length; h++) {
                    tableHTML += `<th>${data.Headers[h]}</th>`
                }
                tableHTML += `</tr>`;
                
                //Add table data
                for(let i = 0; i < totalRows; i++) {

                    tableHTML += `<tr>`;

                    if(categoryIndex < categories.length && (categories[categoryIndex].pos+1) === i) {
                        tableHTML += `<td rowspan="${categories[categoryIndex].rowspan}"><a @click="showDefinition(${categories[categoryIndex].name})">${categories[categoryIndex].name}</a></td>`
                        categoryIndex++;
                    }

                    if(data.Levels > 1 && subCategoryIndex < subCategories.length && (subCategories[subCategoryIndex].pos+1) === i) {
                        tableHTML += `<td rowspan="${subCategories[subCategoryIndex].rowspan}"><a @click="showDefinition(${subCategories[subCategoryIndex].name})">${subCategories[subCategoryIndex].name}</a></td>`;
                        subCategoryIndex++;
                    }

                    if(data.Levels > 2 && subSubCategoryIndex < subSubCategories.length && (subSubCategories[subSubCategoryIndex].pos+1) === i) {
                        if(subSubCategories[subSubCategoryIndex].rowspan == 1) {
                            tableHTML += `<td><a @click="showDefinition(${subSubCategories[subSubCategoryIndex].name})">${subSubCategories[subSubCategoryIndex].name}</a></td>`;
                        } else {
                            tableHTML += `<td rowspan="${subSubCategories[subSubCategoryIndex].rowspan}"><a @click="showDefinition(${subSubCategories[subSubCategoryIndex].name})">${subSubCategories[subSubCategoryIndex].name}</a></td>`;
                        }
                        subSubCategoryIndex++;
                    }

                    if(data.Levels > 3 && subSubSubCategoryIndex < subSubSubCategories.length && (subSubSubCategories[subSubSubCategoryIndex].pos+1) === i) {
                        if(subSubSubCategories[subSubSubCategoryIndex].rowspan == 1) {
                            tableHTML += `<td><a @click="showDefinition(${subSubSubCategories[subSubSubCategoryIndex].name})">${subSubSubCategories[subSubSubCategoryIndex].name}</a></td>`;
                        } else {
                            tableHTML += `<td rowspan="${subSubSubCategories[subSubSubCategoryIndex].rowspan}"><a @click="showDefinition(${subSubSubCategories[subSubSubCategoryIndex].name})">${subSubSubCategories[subSubSubCategoryIndex].name}</a></td>`;
                        }
                        subSubSubCategoryIndex++;
                    }

                    tableHTML += `</tr>`;
                }

            }
            tableHTML += `</table>`;
            this.tableHTML = tableHTML;

        },
        showDefinition(e) {
            if(e.target.matches('a')) {
                const word = $(e.target).text();
                window.API.send("getDefinition", word);
                window.API.receive("showDefinition", (data) => {
                    eventBus.$emit("showOverlay", data);
                });
            }
        }
    },
    computed: {
        css: function() {
            return `
                <style>
                    .data-table-container {
                        margin: 5vh;
                        overflow-y: scroll !important;
                    }
                    table {
                        text-align: left;
                        border-collapse: collapse;
                        width: 100%;
                    }
                    tr {
                        border-bottom: 1px solid #ccc;
                    }
                    th {
                        color: var(--table-header-color);
                    }
                    td {
                        padding: 1vh;
                    }
                    td a:hover {
                        cursor: pointer;
                        color:  var(--color-hover);
                    }
                </style>
            ` 
        },
        getAllData: function() { return this.$store.getters.getAllData },
        getSubCategory: function() { return this.$store.getters.getSubCategory; },
        getActiveCategory: function() { return this.$store.getters.getActiveCategory; }        
    },
    mounted() {
        $('head').append(this.css);
        eventBus.$on('showData', (type) => { if(type === "Table") this.updateData(); });
    }
});


export default appContentTable;