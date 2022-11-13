/**
 * Simple generic dialog box.
 *  -   Used as template for more sophisticated dialog boxes.
 *  -   By itself, can be used for alerting the user to some messages.
 */
class DialogBox {
    constructor() {
        this.parentContainer = null;
        this.dialogBox = null;
    }

    install(parent_container, heading_text, modal_class, modal_header_class, modal_body_class, modal_footer_class) {
        if (!parent_container) {
            throw "Dialog Box: You must provide a div to install the Dialog Box into.";
        }
        this.parentContainer = parent_container;

        let dialog_box = this.render(heading_text, modal_class, modal_header_class, modal_body_class, modal_footer_class);
        this.addToDOM(dialog_box, parent_container);
    }


    render(heading_text, modal_class = "", modal_header_class, modal_body_class, modal_footer_class) {

        this.dialogBox = Util.tag('div', {'class': 'dialog-box-container'}, "");

        let modal_header = this.renderHeader(heading_text, modal_header_class);
        let br1 = Util.tag('br', {}, "");
        let modal_body = this.renderBody(modal_body_class);
        let br2 = Util.tag('br', {}, "");
        let modal_footer = this.renderFooter(modal_footer_class);
        
        let modal = Util.tag('div', {'class': `sura-modal ${modal_class}`}, [modal_header, br1, modal_body, br2, modal_footer]);
        this.dialogBox.append(modal);
        
        return this.dialogBox;
    }

    renderHeader(heading_text = "Heading Goes Here", modal_header_class = "") {
        let h2 = Util.tag('h2', {}, heading_text);
        let modal_header = Util.tag('div', {'class': `sura-modal-header ${modal_header_class}`}, [h2]);
        let button = new ModalHeaderCloseButton();
        button.install(modal_header, this.dialogBox);
        return modal_header;
    }


    renderBody(modal_body_class = "") {
        return Util.tag('div', {'class': `sura-modal-body ${modal_body_class}`}, "");
    }


    renderFooter(modal_footer_class = "") {
        let modal_footer = Util.tag('div', {'class': `sura-modal-footer ${modal_footer_class}`}, "");
        return modal_footer;
    }


    addToDOM(dialog_box, parentContainer) {
        parentContainer.append(dialog_box);
    }


    removeFromDOM() {
        this.dialogBox.remove();    }


    _resetInstanceVariables() {
        this.parentContainer = null;
        this.dialogBox = null;
    }
}





class AddLinkDialogBox extends DialogBox {
    constructor(data_model, article_index, link_section_index) {
        super();
        this.dataModel = data_model;
        this.articleIndex = article_index;
        this.linkSectionIndex = link_section_index;

        this.addLinkButtonContainer = null;
        this.addLinkButton = null;
        this.textField = null;
        this.urlField = null;

        this._onAddLink = this._onAddLink.bind(this);
    }

    install(parent_container, add_link_button_container, add_link_button) {
        this.addLinkButtonContainer = add_link_button_container;
        this.addLinkButton = add_link_button;
        super.install(parent_container, "Add Link");
    }


    renderBody(modal_body_class = "") {
        // For text on button
        let label_1 = Util.tag('label', {'for': 'link-name'}, "Enter button label: ");
        let td_1_1 = Util.tag('td', {}, label_1);
        let input_1 = Util.tag('input', {'type': 'text', 'id': 'link-name'}, "");
        this.textField = input_1;
        let td_1_2 = Util.tag('td', {}, input_1);
        let tr_1 = Util.tag('tr', {}, [td_1_1, td_1_2]);


        // For link attached to button
        let label_2 = Util.tag('label', {'for': 'URL'}, "Enter link here: ");
        let td_2_1 = Util.tag('td', {}, label_2);
        let input_2 = Util.tag('input', {'type': 'text', 'id': 'URL'}, "");
        this.urlField = input_2;
        let td_2_2 = Util.tag('td', {}, input_2);
        let tr_2 = Util.tag('tr', {}, [td_2_1, td_2_2]);


        let table = Util.tag('table', {'class': 'add-link-table'}, [tr_1, tr_2]);
        let modal_body = Util.tag('div', {'class': `sura-modal-body ${modal_body_class}`}, table);
        return modal_body;
    }


    renderFooter(modal_footer_class = "") {
        let modal_footer = Util.tag('div', {'class': `sura-modal-footer ${modal_footer_class}`}, "");
        let button = new ModalFooterButton();
        button.install(modal_footer, 'save', "Add Link");
        button.button.addEventListener('click', this._onAddLink);
        return modal_footer;
    }

    async _onAddLink() {
        // Retrieve info from dialog box.
        let text = this.textField.value;
        let url = this.urlField.value;

        // Closes the dialog box.
        this.dialogBox.remove();

        // Deletes the "Add Link" button.
        this.addLinkButton.remove();

        // Adds the new link to data model.
        this.dataModel.webpage.articles[this.articleIndex].links[this.linkSectionIndex].push({"text":text, "url":url})
        let link_index = this.dataModel.webpage.articles[this.articleIndex].links[this.linkSectionIndex].length - 1

        // Creates a new link button.
        let link_button = new LinkButton(this.dataModel, this.articleIndex, this.linkSectionIndex, link_index);
        await link_button.install(this.addLinkButtonContainer, text, url, true);

        // Adds the "Add Link" button after the newly added link button.
        let addLinkButton = new AddLinkButton(this.dataModel, this.articleIndex, this.linkSectionIndex);
        addLinkButton.install(this.addLinkButtonContainer);
    }

    _resetInstanceVariables() {
        super._resetInstanceVariables();
        this.addLinkButtonContainer = null;
        this.addLinkButton = null;
        this.textField = null;
        this.urlField = null;
    }
}

class AddNavLinkDialogBox extends DialogBox {
    constructor(data_model) {
        super();

        this.dataModel = data_model;
        this.addNavLinkButtonContainer = null;
        this.addNavLinkButton = null;
        this.textField = null;
        this.urlField = null;

        this._onAddNavLink = this._onAddNavLink.bind(this);
    }

    install(parent_container, add_navlink_button_container, add_navlink_button) {
        this.addNavLinkButtonContainer = add_navlink_button_container;
        this.addNavLinkButton = add_navlink_button;
        super.install(parent_container, "Add Nav Link");
    }


    renderBody(modal_body_class = "") {
        // For text on button
        let label_1 = Util.tag('label', {'for': 'navlink-name'}, "Enter button label: ");
        let td_1_1 = Util.tag('td', {}, label_1);
        let input_1 = Util.tag('input', {'type': 'text', 'id': 'navlink-name'}, "");
        this.textField = input_1;
        let td_1_2 = Util.tag('td', {}, input_1);
        let tr_1 = Util.tag('tr', {}, [td_1_1, td_1_2]);


        // For link attached to button
        let label_2 = Util.tag('label', {'for': 'nav-URL'}, "Enter link here: ");
        let td_2_1 = Util.tag('td', {}, label_2);
        let input_2 = Util.tag('input', {'type': 'text', 'id': 'nav-URL'}, "");
        this.urlField = input_2;
        let td_2_2 = Util.tag('td', {}, input_2);
        let tr_2 = Util.tag('tr', {}, [td_2_1, td_2_2]);

        // For get-link-from-page button
        let td_3_1 = Util.tag('td', {}, "Get link from page: ");
        let td_3_2 = Util.tag('td', {}, "");
        new GenerateLinkButton().install(td_3_2, this.urlField);

        let tr_3 = Util.tag('tr', {}, [td_3_1, td_3_2]);


        let table = Util.tag('table', {'class': 'add-link-table'}, [tr_1, tr_2, tr_3]);
        let modal_body = Util.tag('div', {'class': `sura-modal-body ${modal_body_class}`}, table);
        return modal_body;
    }


    renderFooter(modal_footer_class = "") {
        let modal_footer = Util.tag('div', {'class': `sura-modal-footer ${modal_footer_class}`}, "");
        let button = new ModalFooterButton();
        button.install(modal_footer, 'save', "Add Link");
        button.button.addEventListener('click', this._onAddNavLink);
        return modal_footer;
    }

    async _onAddNavLink() {
        // Retrieve info from dialog box.
        let text = this.textField.value;
        let url = this.urlField.value;

        // Closes the dialog box.
        this.dialogBox.remove();

        // Adds the new link to data model.
        this.dataModel.webpage.sidebar.push([text, url]);

        // Creates a new link button.
        let li = Util.tag('li', {}, "");
        let link_button = new NavLinkButton();
        link_button.install(li, text, url);
        this.addNavLinkButtonContainer.before(li);
        Sidebar.enterSidebarEditMode(li, this.dataModel);
    }

    _resetInstanceVariables() {
        super._resetInstanceVariables();
        this.addNavLinkButtonContainer = null;
        this.addNavLinkButton = null;
        this.textField = null;
        this.urlField = null;
    }
}


class TemplateDialogBox extends DialogBox {
    constructor(data_model) {
        super();

        this.dataModel = data_model;
        this.elemAfterArticle = null;
    }

    install(parent_container, elem_after_article) {
        this.elemAfterArticle = elem_after_article;
        super.install(parent_container, "Choose Template", "popup-menu");
    }

    renderBody(modal_body_class = "") {
        let temp1 = this.renderTemplateOption('template-1', "Template 1");
        let temp2 = this.renderTemplateOption('template-2', "Template 2");
        let temp3 = this.renderTemplateOption('template-3', "Template 3");
        let temp4 = this.renderTemplateOption('template-4', "Template 4");
        let temp5 = this.renderTemplateOption('template-5', "Template 5");
        let temp6 = this.renderTemplateOption('template-6', "Template 6");
        let temp7 = this.renderTemplateOption('template-7', "Template 7");
        let temp8 = this.renderTemplateOption('template-8', "Template 8");
        let temp9 = this.renderTemplateOption('template-9', "Template 9");
        let temp10 = this.renderTemplateOption('template-10', "Template 10");
        let temp11 = this.renderTemplateOption('template-11', "Template 11");


        let ul = Util.tag('ul', {'id': 'templates'}, [temp1, temp2, temp3, temp4, temp5, temp6, temp7, temp8, temp9, temp10, temp11]);
        return Util.tag('div', {'class': `sura-modal-body ${modal_body_class}`}, ul);
    }


    renderTemplateOption(id, text) {
        let li = Util.tag('li', {}, "");
        new TemplateButton(this.dataModel).install(li, id, text, this.elemAfterArticle, this.dialogBox);
        return li;
    }
}


class MakeNewPageDialogBox extends DialogBox {
    constructor() {
        super();

        this.input = null;

        this._onCreateNewPage = this._onCreateNewPage.bind(this);
    }
    
    install(parent_container) {
        super.install(parent_container, "Make a New Page");
    }

    renderBody(modal_body_class = "") {
        let input = Util.tag('input', {'type': 'text', 'id': 'webpage-id'}, "");
        this.input = input;
        let label = Util.tag('label', {}, ["New Webpage ID: ", input]);
        return Util.tag('div', {'class': `sura-modal-body ${modal_body_class}`}, label);
    }


    renderFooter(modal_footer_class = "") {
        let modal_footer = Util.tag('div', {'class': `sura-modal-footer ${modal_footer_class}`}, "");
        let button = new ModalFooterButton();
        button.install(modal_footer, 'create-new-page', "Create");
        button.button.addEventListener('click', this._onCreateNewPage);
        return modal_footer;
    }


    async _onCreateNewPage() {
        if (!this.input.value.match(/^[0-9A-Za-z]+$/)) {
            alert("Input is not alphanumeric");
            return;
        }

        let file_name = this.input.value + ".html";
        await apiRequest("POST", "/protected/webpages", {"id": file_name});
        let url = "/html_not_core/" + file_name;
        window.location.href = url;
    }
}



// Primary/Secondary NavCache now stores website display names so that it is not
// lost when we exclude the website from the navbar in a single session.
class NavbarDialogBox extends DialogBox {
    constructor(data_model, number_of_columns = 4) {
        super();
        this.numberOfColumns = number_of_columns;
        this.dataModel = data_model;
        this.primaryNavCache = {};
        this.secondaryNavCache = {};
        this.primaryNavData = null;
        this.secondaryNavData = null;
        this.listOfWebpages = null;
        this.listOfWebpageUrls = null;
        this.table = null;
        this.activeNavTable = "primary";
        this.parentContainer = null;

        this.includeSelectTag = null;
        this.excludeSelectTag = null;

        this._onAddNewNavlink = this._onAddNewNavlink.bind(this);
        this._updateNavTable = this._updateNavTable.bind(this);
    }

    install(parent_container, list_of_webpages, list_of_webpage_urls, primary_nav_data, secondary_nav_data) {
        this.parentContainer = parent_container;
        this.primaryNavData = primary_nav_data;
        this.secondaryNavData = secondary_nav_data;
        this.listOfWebpages = list_of_webpages;
        this.listOfWebpageUrls = list_of_webpage_urls;
        this.primaryNavCache = this.getNavCache(primary_nav_data, list_of_webpage_urls);
        // this.secondaryNavCache = this.getNavCache(secondary_nav_data, list_of_webpage_urls);
        // TODO: Uncomment the above code after entering secondary nav data to the backend.

        super.install(parent_container, "Edit Navigation Bar");
    }

    getNavCache(nav_data, webpage_urls) {
        let nav_cache = {};
        let included_webpages = [];
        for (let link of nav_data) {
            let webpage_name = link[1].split("/").slice(-1)[0];
            nav_cache[webpage_name] = link;
            included_webpages.push(link[1]);
        }
        for (let url of webpage_urls) {
            if (!included_webpages.includes(url)) {
                let link = ["", url]
                let webpage_name = url.split("/").slice(-1)[0];
                nav_cache[webpage_name] = link;
            }
        }
        return nav_cache;
    }

    renderBody(modal_body_class = "content") {

        let control_panel = this.renderWebpageSelector();
        this.renderTable(control_panel);
        return Util.tag('div', {'class': `sura-modal-body ${modal_body_class}`}, control_panel);
    }

    renderWebpageSelector() {
        let h3 = Util.tag('h3', {}, "Primary Navbar");

        let exclude_label = Util.tag('label', {'for': 'select1'}, "Exclude: ");
        let exclude_select = Util.tag('select', {'multiple': '', 'name': 'select1', 'id': 'select1', 'class': 'excluded-links'}, "");
        this.excludeSelectTag = exclude_select;
        let exclude_list = Util.tag('div', {'class': 'nav-list'}, [exclude_label, exclude_select]);
        
        let include_label = Util.tag('label', {'for': 'select2'}, "Include: ");
        let include_select = Util.tag('select', {'multiple': '', 'name': 'select2', 'id': 'select2', 'class': 'included-links'}, "");
        this.includeSelectTag = include_select;
        let include_list = Util.tag('div', {'class': 'nav-list'}, [include_label, include_select]);

        this.renderNavLists(this.primaryNavData, this.listOfWebpages);

        let include_exclude_control = Util.tag('div', {'class': 'nav-include-exclude'}, "");
        let include_exclude_button = new IncludeExcludeButtons(this.dataModel);
        include_exclude_button.install(include_exclude_control, this.includeSelectTag, this.excludeSelectTag, this._updateNavTable);

        let div = Util.tag('div', {'class': 'nav-control'}, [exclude_list, include_exclude_control, include_list]);
        return Util.tag('div', {'class': 'nav-control-panel'}, [h3, div]);
    }

    renderNavLists(nav_data, list_of_webpages) {
        let included_webpages = [];
        for (let link of nav_data) {
            let webpage = link[1].split("/").slice(-1)[0];
            included_webpages.push(webpage);
        }

        this.excludeSelectTag.textContent = "";
        this.includeSelectTag.textContent = "";

        for (let webpage of list_of_webpages) {
            if (included_webpages.includes(webpage)) {
                let option = Util.tag('option', {'value': `${this.includeSelectTag.options.length + 1}`}, webpage);
                option.value = this.includeSelectTag.options.length + 1;
                this.includeSelectTag.append(option);
            }
            else {
                let option = Util.tag('option', {}, webpage);
                this.excludeSelectTag.append(option);
            }
        }
    }

    renderTable(control_panel) {
        let row_headings = ["Order", "Webpage Name", "Display Name", "Move Up/Down"];
        let row_body = [];
        
        for (let i = 0; i < this.includeSelectTag.options.length; i++) {
            let webpage_name = this.includeSelectTag.options[i].textContent;
            let display_name = this.primaryNavCache[webpage_name][0];
            let row_data = this._prepareRowData(this.activeNavTable, i + 1, webpage_name, display_name);
            row_body.push(row_data);
        }
        
        this.table = new Table(this.numberOfColumns);
        this.table.install(control_panel, row_headings, row_body, "Names to Display on Navbar");
    }

    renderFooter(modal_footer_class = "") {
        let modal_footer = Util.tag('div', {'class': `sura-modal-footer ${modal_footer_class}`}, "");
        let button = new ModalFooterButton();
        button.install(modal_footer, 'save', "Apply");
        button.button.addEventListener('click', this._onAddNewNavlink);
        return modal_footer;
    }

    /**
     * Syncs the nav table data with nav list data in the include list.
     * 
     * @param {*} add_to_table | boolean
     * @param {*} webpage_names_and_ranks | [["name.html", "1"], ["name2.html", "3"]]
     */
    _updateNavTable(add_to_table, webpage_names_and_ranks) {
        if (add_to_table) {
            // Append new rows
            for (let webpage of webpage_names_and_ranks) {
                // Prepare data
                let webpage_name = webpage[0];
                let webpage_rank = this.table.numberOfRows;
                let display_name = this.primaryNavCache[webpage_name][0];

                // Append row
                let row_data = this._prepareRowData(this.activeNavTable, webpage_rank, webpage_name, display_name);
                this.table.appendRow(row_data);
            }
            
            // Adjust number of Move Up/Down buttons for the previous last row
            let prev_num_of_rows = this.table.numberOfRows - webpage_names_and_ranks.length;
            if (prev_num_of_rows > 1) {
                let row_num = this.table.numberOfRows - webpage_names_and_ranks.length - 1;
                let col_3 = this.table.table.querySelector(`.row-${row_num} .col-3`);
                col_3.textContent = "";
                let new_col_3_content = this._generateCol3(row_num);
                col_3.append(new_col_3_content);
            }


        } else {
            let deleted_ranks = [];
            // Delete rows
            for (let i = 0; i < webpage_names_and_ranks.length; i++) {
                // We subtract i from rank it because when we delete one row, the rank of the rows below it increases (approaches 0).
                // To correct this, we subtract i.
                let webpage_original_rank = parseInt(webpage_names_and_ranks[i][1]);
                let webpage_rank = webpage_original_rank;
                for (let rank of deleted_ranks) {
                    if (rank < webpage_original_rank) {
                        webpage_rank--;
                    }
                }
                deleted_ranks.push(webpage_original_rank);

                this.table.deleteRow(webpage_rank);
                this._correctColumnNumbers(webpage_rank);
            }

            // Adjust number of Move Up/Down buttons for the new last row
            if (this.table.numberOfRows <= 1) return;
            if (this.table.numberOfRows === 2) {
                let col_3 = this.table.table.querySelector('.row-1 .col-3');
                col_3.textContent = "";
                return;
            }
            let prev_num_of_rows = this.table.numberOfRows + deleted_ranks.length;
            for (let rank of deleted_ranks) {
                if (rank === 1) {
                    let row_num = 1;
                    let col_3 = this.table.table.querySelector('.row-1 .col-3');
                    col_3.textContent = "";
                    let new_col_3_content = this._generateCol3(row_num);
                    col_3.append(new_col_3_content);
                } else if (rank === prev_num_of_rows - 1) {
                    if (this.table.numberOfRows === 2) break;
                    let row_num = this.table.numberOfRows - 1;
                    let col_3 = this.table.table.lastElementChild.querySelector('.col-3');
                    col_3.textContent = "";
                    let new_col_3_content = this._generateCol3(row_num);
                    col_3.append(new_col_3_content);
                } 
            }
        }
    }

    /**
     * Assumes that the column numbers assigned through classes are already corrected with the table component.
     * This function corrects the value inside the first column of the nav table.
     * 
     * @param {*} webpage_rank | The topmost row whose textContent for the first column needs to be updated. 
     */
    _correctColumnNumbers(webpage_rank) {
        // Corrects the numbers in column 0 for the rows below the row that was deleted.
        while (webpage_rank < this.table.numberOfRows) {
            let rank_column = this.table.table.querySelector(`.row-${webpage_rank} .col-0`);
            rank_column.textContent = `${webpage_rank}`;
            webpage_rank++;
        }
    }


    async _onAddNewNavlink() {
        // TODO: Redo this to directly reflect changes to datamodel. Extend support to secondary nav bar. Need to make a new patch handler in the server for that.
        let navbar_update = {
            "primary_navbar" : [],
            "secondary_navbar" : []
        };

        // This query search is orderd.
        let navbar_table_labels = this.parentContainer.querySelectorAll(".nav-display-list label");
        for (let label of navbar_table_labels) {
            let webpage_name = label.textContent;
            if (webpage_name !== "") {
                navbar_update["primary_navbar"].push(this.primaryNavCache[webpage_name]);
            }
        }

        let res = await apiRequest("PATCH", `/protected/navbars/${this.dataModel.webpageNameNoExtension}`, navbar_update);
        Util.reloadWebpage();
    }

    /**
     * Assumes that the inlude list gets upated before row data is prepared.
     * 
     * @param {*} which_navbar | primary or secondary
     */
    _prepareRowData(which_navbar, which_row, webpage_name = "", display_name = "") {
        // Column 1
        let label = Util.tag('label', {'for': `${which_navbar}_link${which_row}`}, webpage_name);
        
        // Column 2
        let input = Util.tag('input', {'type': 'text', 'id': `${which_navbar}_link${which_row}`, 'value': display_name}, "");
        input.addEventListener('input', () => {
            if (which_navbar === "primary") {
                this.primaryNavCache[webpage_name][0] = input.value;
            } else {
                this.secondaryNavCache[webpage_name][0] = input.value;
            }
        });

        // Column 3
        let div = this._generateCol3(which_row);
    
        return [`${which_row}`, label, input, div];
    }
    
    /**
     * We use this.includeSelectTag.options.length instead of this.table.numberOfRows because when data is prepared initially, the table instance isn't created yet. So, before the navbar dialog box loads on screen, we do not have this.table.numberOfRows.
     * 
     * @param {*} which_row 
     * @returns 
     */
    _generateCol3(which_row) {
        let div = Util.tag('div', {}, "");
        if (this.includeSelectTag.options.length <= 1) {
            return div;
        }

        if (which_row === 1) {
            new MoveUpDownButtons(this.includeSelectTag, this.excludeSelectTag).installMoveDownButton(div);
        } else if (which_row === this.includeSelectTag.options.length) {
            new MoveUpDownButtons(this.includeSelectTag, this.excludeSelectTag).installMoveUpButton(div);
        } else if (which_row > 1 && which_row < this.includeSelectTag.options.length) {
            new MoveUpDownButtons(this.includeSelectTag, this.excludeSelectTag).install(div);
        }
        return div;
    }

    

}