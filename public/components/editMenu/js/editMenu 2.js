class EditMenu {
    constructor(data_model) {
        
        this.dataModel = data_model;
        this.primaryNavData = data_model.primaryNavbar;
        this.secodaryNavData = data_model.secodaryNavbar;
        this.listOfWebpages = data_model.listOfWebpages;
        this.listOfWebpageUrls = data_model.listOfWebpageUrls;
        this.webpageData = data_model.webpage;

        // Containers
        this.parentContainer = null;
        this.articlesContainer = null;
        this.sidebarContainer = null;
        this.dialogBoxContainer = null;

        this.adminControls = null;
        this.saveCancelControls = null;
        this.showHideButtonDiv = null;

        // Expand/Collapse Buttons
        this.circleButton = null;
        this.circleButtonSpan = null;

        // Admin Control Buttons
        this.makeNewPageButton = null;
        this.editNavbarButton = null;
        this.editPageButton = null;
        this.makeSidebarButton = null;
        this.editSidebarButton = null;
        this.deleteSidebarButton = null;
        this.deletePageButton = null;

        // Save/Delete Buttons
        this.saveButton = null;
        this.cancelButton = null;

        this._expand = this._expand.bind(this);
        this._collapse = this._collapse.bind(this);
        this._saveChanges = this._saveChanges.bind(this);
        this._reloadWebpage = this._reloadWebpage.bind(this);
    }


    install(parent_container, articles_container, sidebar_container, dialog_boxes_contaner) {
        if (!parent_container) {
            throw "Edit Menu: You must provide a div to install the Edit Menu into.";
        } else if (!articles_container) {
            throw "Edit Menu: You must provide the div that contains the articles.";
        } else if (!sidebar_container && this.webpageData.sidebar.length !== 0) {
            throw "Edit Menu: You must provide a div that contains the sidebar.";
        } else if (!dialog_boxes_contaner) {
            throw "Edit Menu: You must provide a div that contains the dialog boxes.";
        }
        this.parentContainer = parent_container;
        this.articlesContainer = articles_container;
        this.sidebarContainer = sidebar_container;
        this.dialogBoxContainer = dialog_boxes_contaner;

        let edit_menu = this.render();
        this.addEventListeners();
        this.addToDOM(edit_menu, parent_container);
    }


    render() {
        let edit_menu = []
        edit_menu.push(this.renderShowHideButton());
        edit_menu.push(this.renderAdminControls());
        return edit_menu;
    }


    renderShowHideButton() {
        let span = Util.tag('span',{'class': 'material-icons'}, "add");
        this.circleButtonSpan = span;
        let button = Util.tag('button', {'id': 'expand'}, span);
        this.circleButton = button;
        let div = Util.tag('div', {'id': 'expand-collapse'}, button);
        this.showHideButtonDiv = div;
        return div;
    }


    renderAdminControls() {
        let div = Util.tag('div', {'id': 'admin-controls', 'class': 'hidden'}, "");


        let ACB_inst;

        ACB_inst = new AdminControlButton();
        ACB_inst.install(div, "make-new-page", "Make New Page", "note_add");
        this.makeNewPageButton = ACB_inst.button;

        ACB_inst = new AdminControlButton();
        ACB_inst.install(div, "edit-nav-bar", "Edit Nav Bar", "build");
        this.editNavbarButton = ACB_inst.button;

        ACB_inst = new AdminControlButton();
        ACB_inst.install(div, "edit-page", "Edit Page", "edit")
        this.editPageButton = ACB_inst.button;

        if (this.webpageData["sidebar"].length === 0) {
            ACB_inst = new AdminControlButton();
            ACB_inst.install(div, "make-sidebar", "Make Sidebar", "add")
            this.makeSidebarButton = ACB_inst.button;
        } else {
            ACB_inst = new AdminControlButton();
            ACB_inst.install(div, "edit-sidebar", "Edit Sidebar", "view_sidebar")
            this.editSidebarButton = ACB_inst.button;
    
            ACB_inst = new AdminControlButton();
            ACB_inst.install(div, "delete-sidebar", "Delete Sidebar", "delete_sweep")
            this.deleteSidebarButton = ACB_inst.button;
        }

        ACB_inst = new AdminControlButton();
        ACB_inst.install(div, "delete-page", "Delete Page", "delete")
        this.deletePageButton = ACB_inst.button;

        this.adminControls = div;
        return div;
    }

    renderSaveCancelControls() {
        let div = Util.tag('div', {'id': 'admin-controls'}, "");
        let ACB_inst;

        ACB_inst = new AdminControlButton();
        ACB_inst.install(div, "save-webpage", "Save", "done");
        this.saveButton = ACB_inst.button;
        
        ACB_inst = new AdminControlButton();
        ACB_inst.install(div, "cancel_changes", "Cancel", "close");
        this.cancelButton = ACB_inst.button;
        
        this.saveCancelControls = div;
        return div;
    }


    addEventListeners() {
        this.circleButton.addEventListener('click', this._expand);

        this.makeNewPageButton.addEventListener('click', () => {
            new MakeNewPageDialogBox().install(this.dialogBoxContainer);
        });

        this.editNavbarButton.addEventListener('click', () => {
            new NavbarDialogBox(this.dataModel).install(this.dialogBoxContainer, this.listOfWebpages, this.listOfWebpageUrls, this.primaryNavData);
        });

        this.editPageButton.addEventListener("click", async () => {
            await Article.enterArticlesEditMode(this.articlesContainer, this.dataModel);
            this._switctAdminMenu();
            let empty_space = document.querySelector("#empty-space");
            new BackgroundEditor(this.dataModel).install(empty_space);
            let page_title = document.querySelector("#page-title");
            page_title.setAttribute("contenteditable", "true");
            page_title.addEventListener("input", () => {
                this.dataModel.webpage.title = page_title.textContent;
            });
        });

        if (this.webpageData["sidebar"].length === 0) {
            this.makeSidebarButton.addEventListener('click', () => {
                this.webpageData.sidebar_title = "Navigation Pane";
                this.webpageData.sidebar = [["This Webpage", location.href]];
                this._saveChanges();
            });
        } else {
            this.editSidebarButton.addEventListener('click', () => {
                Sidebar.enterSidebarEditMode(this.sidebarContainer, this.dataModel);
                this._switctAdminMenu();
            });

            this.deleteSidebarButton.addEventListener('click', () => {
                this.webpageData.sidebar_title = "Navigation Pane";
                this.webpageData.sidebar = [];
                this._saveChanges();
            });
        }

        this.deletePageButton.addEventListener('click', async () => {
            let res = await apiRequest("GET", "/protected/webpages/" + this.dataModel.webpageName);
            
            if (res["Page Exists"] === true) {
                let url = "/protected/webpages/" + this.dataModel.webpageName;
                let response = await apiRequest("DELETE", url, {});
                // console.log(response);
                if (response["Message"] === "Success") {
                    window.location.href = "/index.html";
                }
                else {
                    console.log(response["Message"]);
                    alert(response["Message"]);
                }
            }




        });
    }

    _switctAdminMenu() {
        this.adminControls.remove();
        let save_cancel_controls = this.renderSaveCancelControls();
        this.saveButton.addEventListener('click', this._saveChanges);
        this.cancelButton.addEventListener('click', this._reloadWebpage);
        this.addToDOM(save_cancel_controls, this.parentContainer);
    }

    async _saveChanges() {
        await this.dataModel.saveWebpageDataModel();
        this._reloadWebpage();
    }

    _reloadWebpage() {
        Util.reloadWebpage();
    }

    _expand() {
        this._toggleCircleButton(true);

        $("#admin-controls").show("slide", { direction: "down" }, 500);
        

        this.circleButton.removeEventListener('click', this._expand);
        this.circleButton.addEventListener('click', this._collapse);
    }

    _collapse() {
        this._toggleCircleButton(false);

        $("#admin-controls").hide("slide", { direction: "down" }, 500);


        this.circleButton.removeEventListener('click', this._collapse);
        this.circleButton.addEventListener('click', this._expand);
    }

    _toggleCircleButton(collapsed) {
        if (collapsed) {
            this.circleButton.id = "collapse";
            this.circleButtonSpan.textContent = "remove";
        } else {
            this.circleButton.id = "expand";
            this.circleButtonSpan.textContent = "add";
        }

    }

    addToDOM(edit_menu, parent_container) {
        if (edit_menu instanceof Array) {
            for (let elem of edit_menu) {
                parent_container.append(elem);
            }
        } else {
            parent_container.append(edit_menu);
        }
    }


    removeFromDOM() {
        this.adminControls.remove();
        this.saveButton.remove();
        this.showHideButtonDiv.remove();
    }
}