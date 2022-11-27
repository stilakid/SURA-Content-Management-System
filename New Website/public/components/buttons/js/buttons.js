class Button {
    constructor() {
        this.parentContainer = null;
        this.button = null;
    }

    install(parent_container, class_name, text) {
        if (!parent_container) {
            throw "Button: You must provide a div to install the button into.";
        }
        this.parentContainer = parent_container;

        let button = this.render(class_name, text);
        this.addToDOM(button, parent_container);
    }


    render(class_name = "", text = "button") {
        let button = Util.tag('button', {'class': class_name}, text, false);
        this.button = button;
        return button;
    }

    addToDOM(button, parentContainer) {
        if (button instanceof Array) {
            for (let elem of button) {
                parentContainer.append(elem);
            }
        } else {
            parentContainer.append(button);
        }
    }


    removeFromDOM() {
        this.button.remove();
    }


    _resetInstanceVariables() {
        this.parentContainer = null;
        this.button = null;
    }
}


class AddLinkButton extends Button {
    constructor(data_model, article_index, link_section_index) {
        super();
        this.dataModel = data_model;
        this.articleIndex = article_index;
        this.linkSectionIndex = link_section_index;

        this._onClick = this._onClick.bind(this);
    }

    install(parent_container) {
        super.install(parent_container, 'add-link', "Add Link");
        this.button.addEventListener('click', this._onClick);
    }
    

    _onClick() {
        // invoke the add link dialog
        let dialog_box_container = document.querySelector("#temporary");
        let add_link_dialog_box = new AddLinkDialogBox(this.dataModel, this.articleIndex, this.linkSectionIndex);
        add_link_dialog_box.install(dialog_box_container, this.parentContainer, this.button);
    }
}


class LinkButton extends Button {
    constructor(data_model, article_index, link_section_index, link_index) {
        super();
        this.dataModel = data_model;
        this.articleIndex = article_index;
        this.linkSectionIndex = link_section_index;
        this.linkIndex = link_index;

        this.deleteButton = null;
        this.buttonsContainer = null;

        this._onDelete = this._onDelete.bind(this);
    }

    async install(parent_container, text, url, edit_mode) {
        if (!parent_container) {
            throw "LinkButton: You must provide a div to install the link button into.";
        }
        this.parentContainer = parent_container;

        let button = await this.render('link-button', text, url, edit_mode);
        this.addToDOM(button, parent_container);
    }


    async render(class_name = "", text = "button", url = "", edit_mode = false) {
        let a = Util.tag('a', {'href': url}, text);
        let link_button = Util.tag('button', {'class': class_name}, a);
        this.button = link_button;

        if (edit_mode) {
            let delete_button = Util.tag('button', {'class': 'delete-link-button'}, "Delete Link");
            this.deleteButton = delete_button;
            delete_button.addEventListener('click', this._onDelete);
            let div = Util.tag('div', {'class': 'button-link'}, [link_button, delete_button]);
            this.buttonsContainer = div;
            return div;
        } else {
            return link_button;
        }
    }


    removeFromDOM() {
        (this.buttonsContainer) ? this.buttonsContainer.remove() : this.button.remove();
    }


    _onDelete() {
        this.dataModel.webpage.articles[this.articleIndex].links[this.linkSectionIndex][this.linkIndex] = null;
        this.buttonsContainer.remove();
    }


    _resetInstanceVariables() {
        super._resetInstanceVariables();
        this.deleteButton = null;
        this.buttonsContainer = null;
    }
}


class ModalFooterButton extends Button {
    constructor() {
        super();
    }

    install(parent_container, class_name, text) {
        super.install(parent_container, `modal-footer-button ${class_name}`, text);
    }
}

class ModalHeaderCloseButton extends Button {
    constructor() {
        super();
        this.dialogBox = null;

        this._onClick = this._onClick.bind(this);
    }

    install(parent_container, dialog_box) {
        super.install(parent_container, 'cancel', "&times;");

        this.dialogBox = dialog_box;
        this.button.addEventListener('click', this._onClick);
    }

    _onClick() {
        this.dialogBox.remove();
    }

    _resetInstanceVariables() {
        super._resetInstanceVariables();
        this.dialogBox = null;
    }
}


class AddImageButton extends Button {
    static loadImage(parent_container, image_data) {
        console.log('image', image_data);

        let img = Util.tag('img', {'src': image_data.url, 'class': 'image'}, "");
        parent_container.append(img);
        // let aspect_ratio = img.naturalHeight / img.naturalWidth;
        // if (aspect_ratio > 1) {
        //     img.classList.add("portrait");
        // } else {
        //     img.classList.add("landscape");
        // }
        return img;
    }

    static addDeleteImageButton(parent_container, img, data_model, article_index, image_index) {
        let delete_img = new DeleteImageButton(data_model, article_index, image_index);
        delete_img.install(parent_container, img);
    }


    constructor(data_model, article_index, image_index) {
        super();

        this.input = null;
        this.dataModel = data_model;
        this.articleIndex = article_index;
        this.imageIndex = image_index;

        this._onClick = this._onClick.bind(this);
        this._addImg = this._addImg.bind(this);
        this._loadImg = this._loadImg.bind(this);
    }

    install(parent_container) {
        super.install(parent_container, "add-image", "");
        this.input.addEventListener('change', this._addImg);
        this.button.addEventListener('click', this._onClick);
    }

    render(class_name = "", text = "") {
        let input = Util.tag('input', {'type': 'file', 'accept': 'image/*'}, "");
        this.input = input;
        let span = Util.tag('span', {'class': 'material-icons'}, "add_photo_alternate");
        let button = Util.tag('button', {'class': class_name}, [span, text]);
        this.button = button;
        return [input, button];
    }

    // render(class_name = "", text = "") {
    //     let input = Util.tag('input', {'type': 'file', 'accept': 'image/*'}, "");
    //     this.input = input;
    //     let img = Util.tag('img', {'src': Util.addImgPic}, "");
    //     let button = Util.tag('button', {'class': class_name}, [img, text]);
    //     this.button = button;
    //     return [input, button];
    // }

    removeFromDOM() {
        this.button.remove();
        this.input.remove();
    }
    

    _onClick() {
        this.input.click();
    }
    
    // Adds an image when the "add image" button is clicked.
    async _addImg(event) {
        // let file = this.input.files[0];
        let file = event.currentTarget.files[0];
        if (!file) return;

        // Because of fakepath, we can upload the file but cannot display it before uploading.
        // So, we will use data url until we save the page.
        let reader = new FileReader();
        reader.addEventListener("error", (event) => {
            throw new Error("Error reading image file");
        });
        reader.addEventListener("load", this._loadImg);
        reader.readAsDataURL(file);

        let filename = await this.dataModel.uploadImage(file);
        let img_url = `/images/${this.dataModel.webpageNameNoExtension}/${filename}`;
        this.dataModel.webpage.articles[this.articleIndex].images[this.imageIndex] = Util.createImageData(img_url);
    }

    // Assumption: This method will only be evoked by an admin.
    _loadImg(event) {
        let reader = event.currentTarget;
        let img = AddImageButton.loadImage(this.parentContainer, Util.createImageData(reader.result));
        AddImageButton.addDeleteImageButton(this.parentContainer, img, this.dataModel, this.articleIndex, this.imageIndex);
        this.button.remove();
        this.input.remove();
    }

    _resetInstanceVariables() {
        super._resetInstanceVariables();
        this.input = null;
    }
}


class DeleteImageButton extends Button {
    constructor(data_model, article_index, image_index) {
        super();

        this.image = null;
        this.dataModel = data_model;
        this.articleIndex = article_index;
        this.imageIndex = image_index;

        this._deleteImage = this._deleteImage.bind(this);
    }

    install(parent_container, image) {
        if (!image) {
            throw "DeleteImageButton: You must provide an image for the button to delete.";
        }
        this.image = image;
        super.install(parent_container, 'delete-img-button', "Delete Image");
        this.button.addEventListener('click', this._deleteImage);
    }


    // Deletes an image.
    _deleteImage() {
        // Remove previous img and delete button.
        this.image.remove();
        this.button.remove();

        // Remove the image url from the data model. The image stored in the server will be deleted after the server receives the new webpage data.
        this.dataModel.webpage.articles[this.articleIndex].images[this.imageIndex] = null;
        
        // Create and add default buttons
        let add_img_button = new AddImageButton(this.dataModel, this.articleIndex, this.imageIndex);
        add_img_button.install(this.parentContainer);
    }

    _resetInstanceVariables() {
        super._resetInstanceVariables();
        this.image = null;
    }
}


class AdminControlButton extends Button {
    constructor() {
        super();

        this.icon = null;
    }

    install(parent_container, id, text, icon) {
        if (!parent_container) {
            throw "Button: You must provide a div to install the button into.";
        }
        this.parentContainer = parent_container;

        let button = this.render(id, text, icon);
        this.addToDOM(button, parent_container);
    }

    render(id = "", text = "button", icon = "") {
        let span = Util.tag('span', {'class': 'material-icons'}, icon);
        this.icon = span;
        let button = Util.tag('button', {'id': id}, [span, text]);
        this.button = button;
        return button;
    }


    _resetInstanceVariables() {
        super._resetInstanceVariables();
        this.icon = null;
    }
}


class NewSectionButton extends Button {
    constructor(data_model) {
        super();

        this.dataModel = data_model;
        this.buttonContainer = null;
        this._addNewSection = this._addNewSection.bind(this);
    }


    installBefore(elem_after_button) {
        if (!elem_after_button) {
            throw "New Section Button: You must provide an element before which you want to install the button.";
        }
        let button = this.render('new-section', "New Section");
        this.addBefore(button, elem_after_button);

        this.button.addEventListener('click', this._addNewSection);
    }

    installAfter(elem_before_button) {
        if (!elem_before_button) {
            throw "New Section Button: You must provide an element after which you want to install the button.";
        }
        let button = this.render('new-section', "New Section");
        this.addAfter(button, elem_before_button);

        this.button.addEventListener('click', this._addNewSection);
    }


    installInto(container) {
        if (!container) {
            throw "New Section Button: You must provide an element into which you want to install the button.";
        }
        let button = this.render('new-section', "New Section");
        this.addInto(button, container);

        this.button.addEventListener('click', this._addNewSection);
    }

    render(class_name, text) {
        let button = super.render(class_name, text);
        let container = Util.tag('div', {'class': "new-section-container"}, button);
        this.buttonContainer = container;
        return container;
    }


    addBefore(button, elem_after_button) {
        if (button instanceof Array) {
            for (let elem of button) {
                elem_after_button.before(elem);
            }
        } else {
            elem_after_button.before(button);
        }
    }

    addAfter(button, elem_before_button) {
        if (button instanceof Array) {
            for (let elem of button) {
                elem_before_button.after(elem);
            }
        } else {
            elem_before_button.after(button);
        }
    }

    addInto(button, container) {
        if (button instanceof Array) {
            for (let elem of button) {
                container.append(elem);
            }
        } else {
            container.append(button);
        }
    }

    _addNewSection() {
        let popup_menu_container = document.querySelector('#temporary');
        new TemplateDialogBox(this.dataModel).install(popup_menu_container, this.buttonContainer);
    }
}


class TemplateButton extends Button {
    constructor(data_model) {
        super();

        this.elemAfterArticle = null;
        this.template = null;
        this.dialogBox = null;
        this.dataModel = data_model;

        this._addArticle = this._addArticle.bind(this);
    }

    install(parent_container, id, text = 'Article Template Button', elem_after_article, template_dialog_box) {
        if (!parent_container) {
            throw "Template Button: You must provide a div to install the Template Button into.";
        }
        this.parentContainer = parent_container;
        this.elemAfterArticle = elem_after_article;
        this.template = id;
        this.dialogBox = template_dialog_box;

        let button = this.render(id, text);
        button.addEventListener('click', this._addArticle);
        this.addToDOM(button, parent_container);
    }

    render(id, text) {
        let button = Util.tag('button', {'id': id, 'class': 'template'}, "");
        button.style.backgroundImage = `url(${Util.templateImages[id]})`;
        this.button = button;
        return button;
    }

    _addArticle() {
        let new_article_data = Article.getGenericArticleData(this.template);
        new Article(this.dataModel).insert(this.elemAfterArticle, new_article_data);

        // Closes the template dialog box
        this.dialogBox.remove();
    }
}

class IncludeExcludeButtons extends Button {
    constructor(data_model, max_nav_links = 10) {
        super();

        this.dataModel = data_model;
        this.maxNavLinks = max_nav_links;

        this.includeButton = null;
        this.excludeButton = null;
        this.includeList = null;
        this.excludeList = null;
        this.updateNavTable = null;

        this._includeNavlink = this._includeNavlink.bind(this);
        this._excludeNavlink = this._excludeNavlink.bind(this);
    }

    /**
     * Will install both the include and exclude buttons in the same container.
     */
    install(parent_container, include_list, exclude_list, update_nav_table_cb, include_class_name, exclude_class_name) {
        if (!parent_container) {
            throw "Include/Exclude Button: You must provide a div to install the Include/Exclude buttons into.";
        }
        this.parentContainer = parent_container;
        this.includeList = include_list;
        this.excludeList = exclude_list;
        this.updateNavTable = update_nav_table_cb;

        let buttons = this.render(include_class_name, exclude_class_name);
        this.addToDOM(buttons, parent_container);

        this.includeButton.addEventListener('click', this._includeNavlink);
        this.excludeButton.addEventListener('click', this._excludeNavlink);
    }

    installIncludeButton(parent_container, include_list, exclude_list, class_name) {
        if (!parent_container) {
            throw "Include Button: You must provide a div to install the Include button into.";
        }
        this.parentContainer = parent_container;
        this.includeList = include_list;
        this.excludeList = exclude_list;

        let button = this.renderIncludeButton(class_name, "keyboard_double_arrow_right");
        this.addToDOM(button, parent_container);

        this.includeButton.addEventListener('click', this._includeNavlink);
    }

    installExcludeButton(parent_container, include_list, exclude_list, class_name) {
        if (!parent_container) {
            throw "Exclude Button: You must provide a div to install the Exclude button into.";
        }
        this.parentContainer = parent_container;
        this.includeList = include_list;
        this.excludeList = exclude_list;

        let button = this.renderExcludeButton(class_name, "keyboard_double_arrow_left");
        this.addToDOM(button, parent_container);

        this.excludeButton.addEventListener('click', this._excludeNavlink);
    }

    render(include_class_name, exclude_class_name) {
        let include_button = this.renderIncludeButton(include_class_name, "keyboard_double_arrow_right");
        let exclude_button = this.renderExcludeButton(exclude_class_name, "keyboard_double_arrow_left");
        return [include_button, exclude_button];
    }

    renderIncludeButton(class_name, icon) {
        this.includeButton = this.renderButton(`include ${class_name}`, icon);
        return this.includeButton;
    }

    renderExcludeButton(class_name, icon) {
        this.excludeButton = this.renderButton(`exclude ${class_name}`, icon);
        return this.excludeButton;
    }

    renderButton(class_name = "", icon = "") {
        let span = Util.tag('span', {'class': 'material-icons'}, icon);
        let button = Util.tag('button', {'class': class_name}, span);
        return button;
    }

    _includeNavlink() {
        if (this._listSizeExceeded(this.excludeList, this.includeList)) {
            return;
        }
        let webpages_moved = this._moveItemBetweenLists(this.excludeList, this.includeList);
        this.updateNavTable(true, webpages_moved);
    }

    _excludeNavlink() {
        let webpages_moved = this._moveItemBetweenLists(this.includeList, this.excludeList);
        this.updateNavTable(false, webpages_moved);
    }

    _listSizeExceeded = (list1, list2) => {
        let num_of_nav_links = list2.options.length + list1.selectedOptions.length;
        return (num_of_nav_links > this.maxNavLinks);
    }

    _moveItemBetweenLists(list1, list2) {
        let webpages_moved = [];
        let items = [];
        let increase_rank = 0;
        for (let option of list1.options) {
            if (option.selected) {
                items.push(option);
                increase_rank++;
                continue;   // don't want to decrease the value of the option that is going to be taken out. We need this value later.
            }
            option.value -= increase_rank;  // decreases the value of all the options below an option that is going to be taken out of the select tag.
        }
        let length = list2.options.length;
        for (let i = 0; i < items.length; i++) {
            webpages_moved.push([items[i].textContent, items[i].value]);

            items[i].value = length + 1 + i;
            items[i].remove();
    
            list2.append(items[i]);
        }

        return webpages_moved;
    }

    removeFromDOM() {
        this.includeButton.remove();
        this.excludeButton.remove();
    }
}


class MoveUpDownButtons extends Button {
    constructor(include_list, exclude_list) {
        super();

        this.moveUpButton = null;
        this.moveDownButton = null;

        this.includeSelectTag = include_list;
        this.excludeSelectTag = exclude_list;

        this._moveUp = this._moveUp.bind(this);
        this._moveDown = this._moveDown.bind(this);
    }

    install(parent_container) {
        if (!parent_container) {
            throw "Move Up/Down Button: You must provide a div to install the Move Up/Down buttons into.";
        }
        this.parentContainer = parent_container;

        let buttons = this.render();
        this.addToDOM(buttons, parent_container);

        this.moveUpButton.addEventListener('click', this._moveUp);
        this.moveDownButton.addEventListener('click', this._moveDown);
    }

    installMoveUpButton(parent_container) {
        if (!parent_container) {
            throw "Move Up Button: You must provide a div to install the Move Up button into.";
        }
        this.parentContainer = parent_container;

        let button = this.renderMoveUpButton();
        this.addToDOM(button, parent_container);

        this.moveUpButton.addEventListener('click', this._moveUp);
    }

    installMoveDownButton(parent_container) {
        if (!parent_container) {
            throw "Move Down Button: You must provide a div to install the Move Down button into.";
        }
        this.parentContainer = parent_container;

        let button = this.renderMoveDownButton();
        this.addToDOM(button, parent_container);

        this.moveDownButton.addEventListener('click', this._moveDown);
    }

    render() {
        let move_up_button = this.renderMoveUpButton();
        let move_down_button = this.renderMoveDownButton();
        return [move_up_button, move_down_button];
    }

    renderMoveUpButton() {
        this.moveUpButton = this.renderButton(`move_up`, "expand_less");
        return this.moveUpButton;
    }

    renderMoveDownButton() {
        this.moveDownButton = this.renderButton(`move_down`, "expand_more");
        return this.moveDownButton;
    }

    renderButton(class_name = "", icon = "") {
        let span = Util.tag('span', {'class': 'material-icons'}, icon);
        let button = Util.tag('button', {'class': class_name}, span);
        return button;
    }

    _moveUp() {
        let row = this.parentContainer.parentElement.parentElement;
        let row_above = row.previousElementSibling;
        row_above.before(row);

        this._swapRowInfo(row, row_above);
        this._swapListValues(row, row_above);
    }

    _moveDown() {
        let row = this.parentContainer.parentElement.parentElement;
        let row_below = row.nextElementSibling;
        row_below.after(row);

        this._swapRowInfo(row, row_below);
        this._swapListValues(row, row_below);
    }

    _swapRowInfo(row1, row2) {
        this._swapRowClass(row1, row2);
        this._swapOrderNum(row1, row2);
        this._swapButtons(row1, row2);
    }

    _swapRowClass(row1, row2) {
        let row1_class = row1.getAttribute('class');
        let row2_class = row2.getAttribute('class');

        row1.removeAttribute('class');
        row2.removeAttribute('class');

        row1.classList.add(row2_class);
        row2.classList.add(row1_class);
    }

    _swapOrderNum(row1, row2) {
        let row1_col0 = row1.querySelector('.col-0');
        let row2_col0 = row2.querySelector('.col-0');

        let row1_order_num = row1_col0.textContent;
        let row2_order_num = row2_col0.textContent;

        row1_col0.textContent = row2_order_num;
        row2_col0.textContent = row1_order_num;
    }

    _swapButtons(row1, row2) {
        let row1_col3 = row1.querySelector('.col-3');
        let row2_col3 = row2.querySelector('.col-3');

        // I can just append them to row but then if i add a new column, the code will break. So, I'll try to generalize.
        let row1_col2 = row1.querySelector('.col-2');
        let row2_col2 = row2.querySelector('.col-2');

        row1_col2.after(row2_col3);
        row2_col2.after(row1_col3);
    }

    _swapListValues(row1, row2) {
        let webpage_name_1 = row1.querySelector('.col-1').textContent;
        let webpage_name_2 = row2.querySelector('.col-1').textContent;

        let row1_option;
        let row2_option;
        for (let option of this.includeSelectTag.options) {
            if (option.textContent === webpage_name_1) row1_option = option;
            if (option.textContent === webpage_name_2) row2_option = option;
        }
        let temporary_value = row1_option.value;
        row1_option.value = row2_option.value;
        row2_option.value = temporary_value;
    }
}

class AddNavLinkButton extends Button {
    constructor(data_model) {
        super();

        this.dataModel = data_model;
        this._onClick = this._onClick.bind(this);
    }

    install(parent_container) {
        super.install(parent_container, 'add-navlink', "Add Nav Link");
        this.button.addEventListener('click', this._onClick);
    }
    

    _onClick() {
        let dialog_box_container = document.querySelector("#temporary");
        let add_navlink_dialog_box = new AddNavLinkDialogBox(this.dataModel);
        add_navlink_dialog_box.install(dialog_box_container, this.parentContainer, this.button);
    }
}

class GenerateLinkButton extends Button {
    constructor() {
        super();

        this.icon = null;

        this._onClick = this._onClick.bind(this);
        this._getArticleID = this._getArticleID.bind(this);
    }

    install(parent_container, url_input, class_name) {
        if (!parent_container) {
            throw "Generate Link Button: You must provide a div to install the button into.";
        }
        if (!url_input) {
            throw "Generate Link Button: You must provide an input tag to save the article ID retrieved by the button.";
        }
        this.parentContainer = parent_container;
        this.urlInput = url_input;

        let button = this.render(class_name, "");
        button.addEventListener('click', this._onClick);
        this.addToDOM(button, parent_container);
    }

    render(class_name = "", text = "button") {
        let span = Util.tag('span', {'class': 'material-icons'}, "link");
        this.icon = span;
        let button = Util.tag('button', {'class': `generate-link ${class_name}`}, [span, text]);
        this.button = button;
        return button;
    }

    _onClick() {
        let dialog_box_container = this.button.closest('.dialog-box-container');
        dialog_box_container.style.visibility = "hidden";
        document.addEventListener('click', this._getArticleID);
    }

    _getArticleID(event) {
        let elem = event.target;
        let article = elem.closest(".article");
        if (article !== null) {
            let dialog_box_container = this.button.closest('.dialog-box-container');
            dialog_box_container.style.visibility = "visible";
    
            document.removeEventListener("click", this._getArticleID);

            this.urlInput.value = `#${article.id}`;
        }


    }

    _resetInstanceVariables() {
        super._resetInstanceVariables();
        this.icon = null;
    }
}


class NavLinkButton extends Button {
    constructor() {
        super();

        this.deleteButton = null;
        this.buttonsContainer = null;

        this._onDelete = this._onDelete.bind(this);
    }

    install(parent_container, text, url) {
        if (!parent_container) {
            throw "NavLinkButton: You must provide a div to install the link button into.";
        }
        this.parentContainer = parent_container;

        let button = this.render('button-navlink', text, url);
        this.addToDOM(button, parent_container);
    }


    render(class_name = "", text = "button", url = "") {
        let a = Util.tag('a', {'href': url}, text);
        let link_button = Util.tag('div', {'class': class_name}, a);
        this.button = link_button;
        return link_button;
    }


    removeFromDOM() {
        (this.buttonsContainer) ? this.buttonsContainer.remove() : this.button.remove();
    }


    _onDelete() {
        this.buttonsContainer.remove();
    }


    _resetInstanceVariables() {
        super._resetInstanceVariables();
        this.deleteButton = null;
        this.buttonsContainer = null;
    }
}

class DeleteNavLinkButton extends Button {
    constructor(data_model, link_index) {
        super();

        this.dataModel = data_model;
        this.linkIndex = link_index;
        this.icon = null;

        this._onDeleteNavLink = this._onDeleteNavLink.bind(this);
    }

    install(parent_container, class_name) {
        if (!parent_container) {
            throw "Button: You must provide a div to install the button into.";
        }
        this.parentContainer = parent_container;

        let button = this.render(class_name, "");
        button.addEventListener('click', this._onDeleteNavLink);
        this.addToDOM(button, parent_container);
    }

    render(class_name = "", text = "button") {
        let span = Util.tag('span', {'class': 'material-icons'}, "delete");
        this.icon = span;
        let button = Util.tag('button', {'class': `delete-navlink-button ${class_name}`}, [span, text]);
        this.button = button;
        return button;
    }

    _onDeleteNavLink() {
        let link = this.parentContainer.closest("li");
        link.remove();

        this.dataModel.webpage.sidebar[this.linkIndex] = null;
    }

    _resetInstanceVariables() {
        super._resetInstanceVariables();
        this.icon = null;
    }
}

class AddBackgroundImageButton extends Button {
    constructor(data_model) {
        super();

        this.background = null;
        this.backgroundVideo = null;
        this.backgroundVideoSource = null;
        this.input = null;
        this.dataModel = data_model;

        this._onClick = this._onClick.bind(this);
        this._addBackgroundImg = this._addBackgroundImg.bind(this);
    }

    install(parent_container, background, background_video, background_video_source) {
        this.background = background;
        this.backgroundVideo = background_video;
        this.backgroundVideoSource = background_video_source;
        super.install(parent_container);
        this.input.addEventListener('change', this._addBackgroundImg);
        this.button.addEventListener('click', this._onClick);
    }

    render() {
        let label = Util.tag('label', {'class': "bg-button-text"}, "Background Image");
        let span = Util.tag('span', {'class': "material-icons"}, "image");
        let icon = Util.tag('div', {}, span);
        let button = Util.tag('button', {'class': "add-bg-img"}, [label, icon], false);
        this.button = button;
        
        let input = Util.tag('input', {'class': "bg-img-input", 'type': "file", 'accept': "image/*"}, "");
        this.input = input;

        return [button, input];
    }

    _onClick() {
        this.input.click();
    }

    async _addBackgroundImg(event) {
        let file = event.currentTarget.files[0];
        if (!file) return;

        // Because of fakepath, we can upload the file but cannot display it before uploading.
        // So, we will use data url until we save the page.
        let reader = new FileReader();
        reader.addEventListener("error", (event) => {
            throw new Error("Error reading image file");
        });
        reader.addEventListener("load", () => {
            let color_1 = this.dataModel.webpage.background.color[0];
            let color_2 = this.dataModel.webpage.background.color[1];
            Background.loadBackgroundImage(this.background, this.backgroundVideo, this.backgroundVideoSource, reader.result, color_1, color_2);
        });
        reader.readAsDataURL(file);

        let filename = await this.dataModel.uploadImage(file);
        let img_url = `/images/${this.dataModel.webpageNameNoExtension}/${filename}`;
        this.dataModel.webpage.background.image = img_url;
        this.dataModel.webpage.background.video = "";
    }


    _resetInstanceVariables() {

    }
}

class AddBackgroundVideoButton extends Button {
    constructor(data_model) {
        super();

        this.background = null;
        this.backgroundVideo = null;
        this.backgroundVideoSource = null;
        this.input = null;
        this.dataModel = data_model;

        this._onClick = this._onClick.bind(this);
        this._addBackgroundVid = this._addBackgroundVid.bind(this);
    }

    install(parent_container, background, background_video, background_video_source) {
        this.background = background;
        this.backgroundVideo = background_video;
        this.backgroundVideoSource = background_video_source;
        super.install(parent_container);
        this.input.addEventListener('change', this._addBackgroundVid);
        this.button.addEventListener('click', this._onClick);
    }

    render() {
        let label = Util.tag('label', {'class': "bg-button-text"}, "Background Video");
        let span = Util.tag('span', {'class': "material-icons"}, "movie");
        let icon = Util.tag('div', {}, span);
        let button = Util.tag('button', {'class': "add-bg-vid"}, [label, icon], false);
        this.button = button;
        
        let input = Util.tag('input', {'class': "bg-vid-input", 'type': "file", 'accept': "video/*"}, "");
        this.input = input;

        return [button, input];
    }

    _onClick() {
        this.input.click();
    }

    async _addBackgroundVid(event) {
        let file = event.currentTarget.files[0];
        if (!file) return;

        // Because of fakepath, we can upload the file but cannot display it before uploading.
        // So, we will use data url until we save the page.
        let reader = new FileReader();
        reader.addEventListener("error", (event) => {
            throw new Error("Error reading image file");
        });
        reader.addEventListener("load", () => {
            let color_1 = this.dataModel.webpage.background.color[0];
            let color_2 = this.dataModel.webpage.background.color[1];
            Background.loadBackgroundVideo(this.background, this.backgroundVideo, this.backgroundVideoSource, reader.result, color_1, color_2);
        });
        reader.readAsDataURL(file);

        let filename = await this.dataModel.uploadVideo(file);
        let vid_url = `/videos/${this.dataModel.webpageNameNoExtension}/${filename}`;
        this.dataModel.webpage.background.image = "";
        this.dataModel.webpage.background.video = vid_url;
    }


    _resetInstanceVariables() {

    }
}

class AddBackgroundColorButton extends Button {
    constructor(data_model) {
        super();
        this.parentContainer = null;
        this.button1 = null;
        this.button2 = null;
        this.buttonContainers = null;

        this.background = null;
        this.dataModel = data_model;
    }

    install(parent_container, background) {
        if (!parent_container) {
            throw "Button: You must provide a div to install the button into.";
        }
        this.parentContainer = parent_container;
        this.background = background;

        let buttons = this.render();
        this.buttonContainers = buttons;
        this.addToDOM(buttons, parent_container);
    }

    render() {
        let label_1 = Util.tag('label', {'class': "bg-color-label"}, "Color - Top:");
        let button_1 = Util.tag('button', {}, "", false);
        this.button1 = button_1;
        let div_1 = Util.tag('div', {'class': "bg-color-container"}, [label_1, button_1]);
        
        let label_2 = Util.tag('label', {'class': "bg-color-label"}, "Color - Bottom:");
        let button_2 = Util.tag('button', {}, "", false);
        this.button2 = button_2;
        let div_2 = Util.tag('div', {'class': "bg-color-container"}, [label_2, button_2]);

        let pickr_top = this.set_up_color_picker(this.dataModel.webpage.background.color[0], button_1, 'monolith');
        let pickr_bot = this.set_up_color_picker(this.dataModel.webpage.background.color[1], button_2, 'monolith');

        pickr_top.on('save', (color) => {
            if (color !== null) {
                this.dataModel.webpage.background.color[0] = color.toHEXA().toString();
            }
            else {
                this.dataModel.webpage.background.color[0] = "transparent";
            }

            let color_1 = this.dataModel.webpage.background.color[0];
            let color_2 = this.dataModel.webpage.background.color[1];
            let image = this.dataModel.webpage.background.image;
            Background.loadBackgroundColor(this.background, color_1, color_2, image);
        });
        pickr_bot.on('save', (color) => {
            if (color !== null) {
                this.dataModel.webpage.background.color[1] = color.toHEXA().toString();
            }
            else {
                this.dataModel.webpage.background.color[1] = "transparent";
            }

            let color_1 = this.dataModel.webpage.background.color[0];
            let color_2 = this.dataModel.webpage.background.color[1];
            let image = this.dataModel.webpage.background.image;
            Background.loadBackgroundColor(this.background, color_1, color_2, image);
        });

        return [div_1, div_2];
    }

    set_up_color_picker(color, button, theme) {
        const pickr = Pickr.create({
            el: button,
            theme: theme, // or 'monolith', or 'nano'
            default: color,     // Set to existing value for bg color.
            swatches: [             // Set to colors used in the theme of the page.
                'rgba(244, 67, 54, 1)',
                'rgba(233, 30, 99, 0.95)',
                'rgba(156, 39, 176, 0.9)',
                'rgba(103, 58, 183, 0.85)',
                'rgba(63, 81, 181, 0.8)',
                'rgba(33, 150, 243, 0.75)',
                'rgba(3, 169, 244, 0.7)',
                'rgba(0, 188, 212, 0.7)',
                'rgba(0, 150, 136, 0.75)',
                'rgba(76, 175, 80, 0.8)',
                'rgba(139, 195, 74, 0.85)',
                'rgba(205, 220, 57, 0.9)',
                'rgba(255, 235, 59, 0.95)',
                'rgba(255, 193, 7, 1)'
            ],
        
            components: {
        
                // Main components
                preview: true,
                opacity: true,
                hue: true,
        
                // Input / output Options
                interaction: {
                    hex: true,
                    rgba: true,
                    hsla: true,
                    hsva: true,
                    cmyk: true,
                    input: true,
                    clear: true,
                    save: true
                }
            }
        });
    
        return pickr;
    }

    removeFromDOM() {
        for (let container of this.buttonContainers) {
            container.remove();
        }
    }

    _resetInstanceVariables() {

    }
}


class ArticleEditButtons extends Button {
    constructor(data_model, article_index, article_id) {
        super();
        this.dataModel = data_model;
        this.articleIndex = article_index;
        this.articleID = article_id;

        this.deleteButton = null;
        this.editButton = null;
        this.buttonContainer = null;
        this.articleBgEditorInstance = null;

        this._deleteArticle = this._deleteArticle.bind(this);
        this._editArticle = this._editArticle.bind(this);
    }

    install(parent_container) {
        super.install(parent_container);
        this.deleteButton.addEventListener('click', this._deleteArticle);
        this.editButton.addEventListener('click', this._editArticle);
    }

    render() {
        let span_1 = Util.tag('span', {'class': "material-icons"}, "clear");
        let delete_button = Util.tag('button', {'class': "delete-section"}, span_1, false);
        this.deleteButton = delete_button;

        let span_2 = Util.tag('span', {'class': "material-icons"}, "settings");
        let edit_button = Util.tag('button', {'class': "edit-section"}, span_2, false);
        this.editButton = edit_button;

        let button_container = Util.tag('div', {'class': "modify-section"}, [delete_button, edit_button]);
        this.buttonContainer = button_container;

        return button_container;
    }

    _editArticle() {
        if (!this.articleBgEditorInstance) {
            let query = `#${Util.makeQueryValid(this.articleID)}`;
            const article = document.querySelector(`#${Util.makeQueryValid(this.articleID)}`);
            this.articleBgEditorInstance = new ArticleBackgroundEditor(this.dataModel, this.articleIndex);
            this.articleBgEditorInstance.install(article, article);

            $(query).show("slide", { direction: "down" }, 500);
        } else {
            this.articleBgEditorInstance.removeFromDOM();
            this.articleBgEditorInstance = null;
        }
    }

    _deleteArticle() {
        this.buttonContainer.closest(".article").remove();
        this.dataModel.webpage.articles[this.articleIndex] = null;

        let index = this.dataModel.articleArrangement.indexOf(this.articleID);
        this.dataModel.articleArrangement.splice(index, 1);
    }

    removeFromDOM() {
        this.buttonContainer.remove();
    }
}

class AddNewMemberButton extends Button {
    constructor(data_model, article_index) {
        super();
        
        this.dataModel = data_model;
        this.articleIndex = article_index;

        this._addNewMember = this._addNewMember.bind(this);
    }

    install(parent_container) {
        super.install(parent_container);
        this.button.addEventListener('click', this._addNewMember);
    }

    render() {
        let span = Util.tag('span', {'class': "material-icons"}, "person_add");
        let button = Util.tag('button', {'class': "add-member-button"}, span);
        this.button = button;
        return button;
    }

    _addNewMember() {
        // Add data to data model
        let card_index = this.dataModel.webpage.articles[this.articleIndex].images.length;
        // Images start from empty array but texts, subheadings, and links start with two arrays by default (generic article data).
        this.dataModel.webpage.articles[this.articleIndex].images.push(Util.createImageData(Util.defaultMemberPhoto));
        
        if (this.dataModel.webpage.articles[this.articleIndex].texts.length - 1 >= card_index) {
            this.dataModel.webpage.articles[this.articleIndex].texts[card_index] = ["More Info"];
        } else {
            this.dataModel.webpage.articles[this.articleIndex].texts.push(["More Info"]);
        }

        if (this.dataModel.webpage.articles[this.articleIndex].subheadings.length - 1 >= card_index) {
            this.dataModel.webpage.articles[this.articleIndex].subheadings[card_index] = "Name/Title";
        } else {
            this.dataModel.webpage.articles[this.articleIndex].subheadings.push("Name/Title");
        }

        if (this.dataModel.webpage.articles[this.articleIndex].links.length - 1 >= card_index) {
            this.dataModel.webpage.articles[this.articleIndex].links[card_index] = [];
        } else {
            this.dataModel.webpage.articles[this.articleIndex].links.push([]);
        }
        
        
        // Add member card to the DOM
        let new_member = new MemberCard(this.dataModel);
        new_member.install(this.parentContainer);
        MemberCard.enableEditMode(new_member.memberCard, this.dataModel, this.articleIndex, card_index);
    }

    _resetInstanceVariables() {

    }
}

class DeleteMemberButton extends Button {
    constructor(data_model, article_index, image_index) {
        super();

        this.memberCard = null;
        this.dataModel = data_model;
        this.articleIndex = article_index;
        this.cardIndex = image_index;
        this.icon = null;

        this._deleteMember = this._deleteMember.bind(this);
    }
    

    install(parent_container, member_card) {
        console.log("member card", member_card);
        if (!member_card) {
            throw "DeleteMemberButton: You must provide a member card for the button to delete.";
        }
        this.memberCard = member_card;
        super.install(parent_container, 'delete-member-button', "Delete Member");
        this.button.addEventListener('click', this._deleteMember);
    }

    render() {
        let span = Util.tag('span', {'class': 'material-icons'}, "clear");
        this.icon = span;
        let button = Util.tag('button', {'class': "delete-member-button"}, span, false);
        this.button = button;
        return button;
    }

    // Deletes an image.
    _deleteMember() {
        // Remove the member card.
        this.button.remove();
        this.memberCard.remove();

        // Remove the image url from the data model. The image stored in the server will be deleted after the server receives the new webpage data.
        this.dataModel.webpage.articles[this.articleIndex].images[this.cardIndex] = null;
        this.dataModel.webpage.articles[this.articleIndex].links[this.cardIndex] = null;
        this.dataModel.webpage.articles[this.articleIndex].subheadings[this.cardIndex] = null;
        this.dataModel.webpage.articles[this.articleIndex].texts[this.cardIndex] = null;
    }

    _resetInstanceVariables() {
        super._resetInstanceVariables();
    }
}


class AddMemberPhotoButton extends AddImageButton {
    static loadImage(parent_container, image_data) {
        let img = Util.tag('img', {'src': image_data.url, 'class': 'image member-photo'}, "");
        parent_container.append(img);

        return img;
    }

    static addDeleteImageButton(parent_container, img, data_model, article_index, image_index) {
        let delete_img = new DeleteMemberPhotoButton(data_model, article_index, image_index);
        delete_img.install(parent_container, img);
    }

    constructor(data_model, article_index, image_index) {
        super(data_model, article_index, image_index);
    }

    install(parent_container) {
        super.install(parent_container);
        this.input.addEventListener('change', this._addImg);
        this.button.addEventListener('click', this._onClick);
    }

    render(class_name = "", text = "") {
        let input = Util.tag('input', {'type': 'file', 'accept': 'image/*'}, "");
        this.input = input;
        let img = Util.tag('img', {'src': Util.defaultMemberPhoto, 'class': "image member-photo"}, "");
        let button = Util.tag('button', {'class': "add-member-image"}, [img, text]);
        this.button = button;
        return [input, button];
    }

    _loadImg(event) {
        let reader = event.currentTarget;
        let img = AddMemberPhotoButton.loadImage(this.parentContainer, Util.createImageData(reader.result));
        AddMemberPhotoButton.addDeleteImageButton(this.parentContainer, img, this.dataModel, this.articleIndex, this.imageIndex);
        this.button.remove();
        this.input.remove();
    }
}


class DeleteMemberPhotoButton extends Button {
    constructor(data_model, article_index, image_index) {
        super();

        this.image = null;
        this.dataModel = data_model;
        this.articleIndex = article_index;
        this.imageIndex = image_index;

        this._deleteImage = this._deleteImage.bind(this);
    }

    install(parent_container, image) {
        if (!image) {
            throw "DeleteMemberPhotoButton: You must provide an image for the button to delete.";
        }
        this.image = image;
        super.install(parent_container, 'delete-member-image', "Delete Image");
        this.button.addEventListener('click', this._deleteImage);
    }

    // Deletes an image.
    _deleteImage() {
        // Remove previous img and delete button.
        this.image.remove();
        this.button.remove();

        // Remove the image url from the data model. The image stored in the server will be deleted after the server receives the new webpage data.
        this.dataModel.webpage.articles[this.articleIndex].images[this.imageIndex] = Util.createImageData(Util.defaultMemberPhoto);
        
        // Create and add default buttons
        let add_img_button = new AddMemberPhotoButton(this.dataModel, this.articleIndex, this.imageIndex);
        add_img_button.install(this.parentContainer);
    }


    _resetInstanceVariables() {
        super._resetInstanceVariables();
        this.image = null;
    }
}


class NavPanelButton extends Button {
    constructor() {
        super();
        this.drawerOpen = false;

        this._onClick = this._onClick.bind(this);
        this._autoClosePanel = this._autoClosePanel.bind(this);
    }

    install(parent_container, nav_panel) {
        super.install(parent_container);
        this.navPanel = nav_panel;
        this.button.addEventListener('click', this._onClick);
        window.addEventListener("resize", this._autoClosePanel);
    }

    render() {
        let span = Util.tag('span', {'class': "material-icons"}, "menu");
        let button = Util.tag('button', {'class': "nav-panel-button"}, span, false);
        this.button = button;
        return button;
    }

    _onClick() {
        if (this.drawerOpen) {
            this.navPanel.style.width = "0";
            document.body.style.marginLeft = "0";
            console.log("closing");
        } else {
            this.navPanel.style.width = "250px";
            document.body.style.marginLeft = "250px";
            console.log("opening")
        }
        this.drawerOpen = !this.drawerOpen;
    }

    // min-width: 769px
    _autoClosePanel() {
        if (this.drawerOpen) {
            this.navPanel.style.width = "0";
            document.body.style.marginLeft = "0";
            console.log("closing");
            this.drawerOpen = !this.drawerOpen;
        }
    }

    _resetInstanceVariables() {

    }
}


class AddNewStickyNoteButton extends Button {
    constructor(data_model, article_index) {
        super();
        
        this.dataModel = data_model;
        this.articleIndex = article_index;

        this._addNewStickyNote = this._addNewStickyNote.bind(this);
    }

    install(parent_container) {
        super.install(parent_container);
        this.button.addEventListener('click', this._addNewStickyNote);
    }

    render() {
        let span = Util.tag('span', {'class': "material-icons"}, "post_add");
        let button = Util.tag('button', {'class': "add-sticky-note-button sticky-note"}, span);
        this.button = button;
        return button;
    }

    _addNewStickyNote() {
        // Add data to data model
        let card_index = this.dataModel.webpage.articles[this.articleIndex].subheadings.length;
        
        if (this.dataModel.webpage.articles[this.articleIndex].texts.length - 1 >= card_index) {
            this.dataModel.webpage.articles[this.articleIndex].texts[card_index] = ["Enter text here"];
        } else {
            this.dataModel.webpage.articles[this.articleIndex].texts.push(["Enter text here"]);
        }

        if (this.dataModel.webpage.articles[this.articleIndex].subheadings.length - 1 >= card_index) {
            this.dataModel.webpage.articles[this.articleIndex].subheadings[card_index] = "Sticky Note";
        } else {
            this.dataModel.webpage.articles[this.articleIndex].subheadings.push("Sticky Note");
        }

        if (this.dataModel.webpage.articles[this.articleIndex].links.length - 1 >= card_index) {
            this.dataModel.webpage.articles[this.articleIndex].links[card_index] = [];
        } else {
            this.dataModel.webpage.articles[this.articleIndex].links.push([]);
        }
        
        
        // Add member card to the DOM
        let new_sticky_note = new StickyNote(this.dataModel);
        new_sticky_note.install(this.parentContainer);
        StickyNote.enableEditMode(new_sticky_note.stickyNote, this.dataModel, this.articleIndex, card_index);
    }

    _resetInstanceVariables() {

    }
}



class DeleteStickyNoteButton extends Button {
    constructor(data_model, article_index, image_index) {
        super();

        this.stickyNote = null;
        this.dataModel = data_model;
        this.articleIndex = article_index;
        this.cardIndex = image_index;
        this.icon = null;

        this._deleteStickyNote = this._deleteStickyNote.bind(this);
    }
    

    install(parent_container, sticky_note) {
        if (!sticky_note) {
            throw "DeleteStickyNoteButton: You must provide a sticky note for the button to delete.";
        }
        this.stickyNote = sticky_note;
        super.install(parent_container, 'delete-sticky-note-button', "Delete Sticky Note");
        this.button.addEventListener('click', this._deleteStickyNote);
    }

    render() {
        let span = Util.tag('span', {'class': 'material-icons'}, "clear");
        this.icon = span;
        let button = Util.tag('button', {'class': "delete-sticky-note-button"}, span, false);
        this.button = button;
        return button;
    }

    // Deletes an image.
    _deleteStickyNote() {
        // Remove the member card.
        this.button.remove();
        this.stickyNote.remove();

        // Remove the image url from the data model. The image stored in the server will be deleted after the server receives the new webpage data.
        this.dataModel.webpage.articles[this.articleIndex].links[this.cardIndex] = null;
        this.dataModel.webpage.articles[this.articleIndex].subheadings[this.cardIndex] = null;
        this.dataModel.webpage.articles[this.articleIndex].texts[this.cardIndex] = null;
    }

    _resetInstanceVariables() {
        super._resetInstanceVariables();
    }
}


class SlideButton extends Button {
    constructor(data_model, article_id) {
        super();

        this.dataModel = data_model;
        let index;
        for (let i = 0; i < data_model.webpage.articles.length; i++) {
            if (data_model.webpage.articles[i] && data_model.webpage.articles[i].article_id === article_id) {
                index = i;
            }
        }
        this.articleIndex = index;
        console.log('index', article_id, this.articleIndex)

        this.leftButton = null;
        this.rightButton = null;
        this.activeIndex = 0;
        this.trasitionWasSet = false;

        this._swipeLeft = this._swipeLeft.bind(this);
        this._swipeRight = this._swipeRight.bind(this);
        this._setHorizontalSlidePosition = this._setHorizontalSlidePosition.bind(this);
        this._adjustSlideHeight = this._adjustSlideHeight.bind(this);
    }

    install(parent_container) {
        if (!parent_container) {
            throw "SlideButton: You must provide a div to install the slide buttons into.";
        }
        this.parentContainer = parent_container;
        let buttons = this.render();
        this.addToDOM(buttons, parent_container);
        this.leftButton.addEventListener('click', this._swipeLeft);
        this.rightButton.addEventListener('click', this._swipeRight);
        window.addEventListener('resize', () => {
            this._setHorizontalSlidePosition();
            this._adjustSlideHeight();
        });
    }

    render(){
        let left_button = this.renderLeftButton();
        let right_button = this.renderRightButton();

        return [left_button, right_button];
    }

    renderLeftButton() {
        let span = Util.tag('span', {'class': "material-icons"}, "arrow_back_ios");
        let button = Util.tag('button', {'class': "slide-button-left"}, span, false);
        this.leftButton = button;
        return button;
    }

    renderRightButton() {
        let span = Util.tag('span', {'class': "material-icons"}, "arrow_forward_ios");
        let button = Util.tag('button', {'class': "slide-button-right"}, span, false);
        this.rightButton = button;
        return button;
    }


    removeFromDOM() {
        this.leftButton.remove();
        this.rightButton.remove();
    }


    _swipeLeft() {
        this.activeIndex--;
        this._moveSlide();
    }

    _swipeRight() {
        this.activeIndex++;
        this._moveSlide();
    }

    _moveSlide() {
        // Set transition when you click on the slide navigation buttons
        if (!this.trasitionWasSet) {
            this._addTransition();
        }

        let num_of_slides = this.parentContainer.querySelectorAll('.slide').length;
        // Correct active index if out of bounds
        if (this.activeIndex === num_of_slides) {
            this.activeIndex = 0;
        } else if (this.activeIndex == -1) {
            this.activeIndex = num_of_slides - 1;
        }

        this._setHorizontalSlidePosition();
    }

    _addTransition() {
        let slides = this.parentContainer.querySelectorAll('.slide');
        let slide_containers = this.parentContainer.querySelectorAll('.slides');
        for (let slide_container of slide_containers) {
            slide_container.style.transition = "all 0.75s";
        }
        for (let slide of slides) {
            slide.style.transition = "1s";
        }
        this.trasitionWasSet = true;
    }

    _setHorizontalSlidePosition() {
        let width = this.parentContainer.getBoundingClientRect().width;
        let slider = this.parentContainer.querySelector('.slides');
        slider.style.transform = `translateX(-${width * this.activeIndex}px)`;
    }

    _adjustSlideHeight() {
        Article.afterLoadingTemplateThirteen(this.parentContainer.parentElement, this.dataModel.webpage.articles[this.articleIndex].images);
        console.log('working')
    }

    _resetInstanceVariables() {
        this.parentContainer = null;
        this.leftButton = null;
        this.rightButton = null;
    }
}


class AddNewSlideButton extends Button {
    static addDeleteSlideButton(parent_container, img, data_model, article_index, card_index) {
        let delete_img = new DeleteImageButton(data_model, article_index, card_index);
        delete_img.install(parent_container, img);
    }

    constructor(data_model, article_index) {
        super();

        this.dataModel = data_model;
        this.articleIndex = article_index;

        this.input = null;
        this.slideIndex = null;

        this._onClick = this._onClick.bind(this);
        this._addNewSlide = this._addNewSlide.bind(this);
        this._loadImg = this._loadImg.bind(this);
    }

    install(parent_container) {
        super.install(parent_container);
        this.input.addEventListener('change', this._addNewSlide);
        this.button.addEventListener('click', this._onClick);
    }

    render() {
        let input = Util.tag('input', {'type': 'file', 'accept': 'image/*', 'class': 'add-new-slide-input'}, "");
        this.input = input;
        let span = Util.tag('span', {'class': "material-icons"}, "add");
        let button = Util.tag('button', {'class': "add-slide-button"}, span);
        this.button = button;
        let slide = Util.tag('div', {'class': "slide add-slide-button-container"}, [input, button]);
        return slide;
    }

    removeFromDOM() {
        this.button.remove();
        this.input.remove();
    }

    _onClick() {
        this.input.click();
    }

    // Adds an image to the slide when the "add slide" button is clicked.
    async _addNewSlide(event) {
        // Add image to DOM
        let file = event.currentTarget.files[0];
        if (!file) return;

        let slide_index = this.dataModel.webpage.articles[this.articleIndex].images.length;
        this.slideIndex = slide_index;
        // Because of fakepath, we can upload the file but cannot display it before uploading.
        // So, we will use data url until we save the page.
        let reader = new FileReader();
        reader.addEventListener("error", (event) => {
            throw new Error("Error reading image file");
        });
        reader.addEventListener("load", this._loadImg);
        reader.readAsDataURL(file);

        // Upload Image to Server
        let filename = await this.dataModel.uploadImage(file);
        let img_url = `/images/${this.dataModel.webpageNameNoExtension}/${filename}`;

        // Add data to data model
        this.dataModel.webpage.articles[this.articleIndex].images.push(Util.createImageData(img_url));
        if (this.dataModel.webpage.articles[this.articleIndex].texts.length - 1 >= slide_index) {
            this.dataModel.webpage.articles[this.articleIndex].texts[slide_index] = ["More Info"];
        } else {
            this.dataModel.webpage.articles[this.articleIndex].texts.push(["More Info"]);
        }

        if (this.dataModel.webpage.articles[this.articleIndex].subheadings.length - 1 >= slide_index) {
            this.dataModel.webpage.articles[this.articleIndex].subheadings[slide_index] = "Slide Title";
        } else {
            this.dataModel.webpage.articles[this.articleIndex].subheadings.push("Slide Title");
        }

        if (this.dataModel.webpage.articles[this.articleIndex].links.length - 1 >= slide_index) {
            this.dataModel.webpage.articles[this.articleIndex].links[slide_index] = [];
        } else {
            this.dataModel.webpage.articles[this.articleIndex].links.push([]);
        }
    }

    // Assumption: This method will only be evoked by an admin.
    _loadImg(event) {
        let reader = event.currentTarget;
        let new_slide = new Slide(this.dataModel);
        new_slide.install(this.parentContainer, Util.createImageData(reader.result));
        Slide.enableEditMode(new_slide.slide, this.dataModel, this.articleIndex, this.slideIndex);
    }

    _resetInstanceVariables() {

    }
}


class DeleteSlideButton extends Button {
    constructor(data_model, article_index, slide_index) {
        super();

        this.slide = null;
        this.dataModel = data_model;
        this.articleIndex = article_index;
        this.slideIndex = slide_index;

        this._deleteSlide = this._deleteSlide.bind(this);
    }
    

    install(parent_container, slide) {
        if (!slide) {
            throw "DeleteSlideButton: You must provide a slide for the button to delete.";
        }
        this.slide = slide;
        super.install(parent_container, 'delete-slide-button', "Delete Slide");
        this.button.addEventListener('click', this._deleteSlide);
    }

    render() {
        let span = Util.tag('span', {'class': 'material-icons'}, "delete");
        this.icon = span;
        let button = Util.tag('button', {'class': "delete-slide-button"}, [span, "Delete Slide"]);
        this.button = button;
        return button;
    }

    
    // Deletes an image.
    _deleteSlide() {
        // Remove the member card.
        this.button.remove();
        this.slide.remove();

        // Remove the image url from the data model. The image stored in the server will be deleted after the server receives the new webpage data.
        this.dataModel.webpage.articles[this.articleIndex].links[this.slideIndex] = null;
        this.dataModel.webpage.articles[this.articleIndex].subheadings[this.slideIndex] = null;
        this.dataModel.webpage.articles[this.articleIndex].texts[this.slideIndex] = null;
        this.dataModel.webpage.articles[this.articleIndex].images[this.slideIndex] = null;
    }

    _resetInstanceVariables() {
        super._resetInstanceVariables();
    }
}

class GetAspectRatioButton extends Button {
    constructor(data_model) {
        super();

        this.dataModel = data_model;

        this._onClick = this._onClick.bind(this);
    }

    install(parent_container, slides_container) {
        super.install(parent_container, "get-aspect-ratio-button", "Use Current Image's Aspect Ratio");
        this.slidesContainer = slides_container;
        this.button.addEventListener('click', this._onClick);
    }

    render() {
        let span = Util.tag('span', {'class': 'material-icons'}, "aspect_ratio");
        this.icon = span;
        let button = Util.tag('button', {'class': "get-aspect-ratio-button"}, [span, "Use Current Image's Aspect Ratio"]);
        this.button = button;
        return button;
    }

    _onClick() {
        // Get dimensions of current image
        let active_slide;
        let bg_image = active_slide.style.backgroundImage;
        let image = new Image();
        image.src = bg_image;
        let width = image.width;
        let height = image.height;


    }

    _resetInstanceVariables() {
    }
}
















class AddArticleBackgroundImageButton extends Button {
    constructor(data_model, article_index) {
        super();

        this.background = null;
        this.backgroundVideo = null;
        this.backgroundVideoSource = null;
        this.input = null;
        this.dataModel = data_model;
        this.articleIndex = article_index;

        this._onClick = this._onClick.bind(this);
        this._addBackgroundImg = this._addBackgroundImg.bind(this);
    }

    install(parent_container, article) {
        this.article = article;
        super.install(parent_container);
        this.input.addEventListener('change', this._addBackgroundImg);
        this.button.addEventListener('click', this._onClick);
    }

    render() {
        let label = Util.tag('label', {'class': "article-bg-button-text"}, "Add Background Image");
        let span = Util.tag('span', {'class': "material-icons"}, "image");
        let icon = Util.tag('div', {}, span);
        let button = Util.tag('button', {'class': "add-article-bg-img"}, [label, icon], false);
        this.button = button;
        
        let input = Util.tag('input', {'class': "article-bg-img-input", 'type': "file", 'accept': "image/*"}, "");
        this.input = input;

        return [button, input];
    }

    _onClick() {
        this.input.click();
    }

    async _addBackgroundImg(event) {
        let file = event.currentTarget.files[0];
        if (!file) return;

        // Because of fakepath, we can upload the file but cannot display it before uploading.
        // So, we will use data url until we save the page.
        let reader = new FileReader();
        reader.addEventListener("error", (event) => {
            throw new Error("Error reading image file");
        });
        reader.addEventListener("load", () => {
            let color_1 = "transparent";
            let color_2 = "transparent";
            if (this.dataModel.webpage.articles[this.articleIndex].background.color_gradient) {
                color_1 = this.dataModel.webpage.articles[this.articleIndex].background.color_gradient[0];
                color_2 = this.dataModel.webpage.articles[this.articleIndex].background.color_gradient[1];
            }
            ArticleBackgroundEditor.loadBackgroundImage(this.article, reader.result, color_1, color_2);
        });
        reader.readAsDataURL(file);

        let filename = await this.dataModel.uploadImage(file);
        let img_url = `/images/${this.dataModel.webpageNameNoExtension}/${filename}`;
        this.dataModel.webpage.articles[this.articleIndex].background.image = img_url;
    }


    _resetInstanceVariables() {

    }
}



class AddArticleBackgroundColorButton extends Button {
    constructor(data_model, article_index) {
        super();
        this.parentContainer = null;
        this.button1 = null;
        this.button2 = null;
        this.buttonContainers = null;

        this.background = null;
        this.dataModel = data_model;
        this.articleIndex = article_index;
    }

    install(parent_container, article) {
        if (!parent_container) {
            throw "AddArticleBackgroundColorButton: You must provide a div to install the Add Article Background Color Button into.";
        }
        this.parentContainer = parent_container;
        this.article = article;

        let buttons = this.render();
        this.buttonContainers = buttons;
        this.addToDOM(buttons, parent_container);
    }

    render() {
        let label_1 = Util.tag('label', {'class': "article-bg-color-label"}, "Color Foreground - Top:");
        let button_1 = Util.tag('button', {}, "", false);
        this.button1 = button_1;
        let div_1 = Util.tag('div', {'class': "article-bg-color-container"}, [label_1, button_1]);
        
        let label_2 = Util.tag('label', {'class': "article-bg-color-label"}, "Color Foreground - Bottom:");
        let button_2 = Util.tag('button', {}, "", false);
        this.button2 = button_2;
        let div_2 = Util.tag('div', {'class': "article-bg-color-container"}, [label_2, button_2]);

        let label_3 = Util.tag('label', {'class': "article-bg-color-label"}, "Color Background:");
        let button_3 = Util.tag('button', {}, "", false);
        this.button3 = button_3;
        let div_3 = Util.tag('div', {'class': "article-bg-color-container"}, [label_3, button_3]);

        let current_color_1 = "transparent";
        let current_color_2 = "transparent";
        let current_color_3 = "transparent";
        if (this.dataModel.webpage.articles[this.articleIndex].background.color_gradient) {
            current_color_1 = this.dataModel.webpage.articles[this.articleIndex].background.color_gradient[0];
            current_color_2 = this.dataModel.webpage.articles[this.articleIndex].background.color_gradient[1];
        }
        if (this.dataModel.webpage.articles[this.articleIndex].background.color) {
            current_color_3 = this.dataModel.webpage.articles[this.articleIndex].background.color;
        }
        let pickr_top = this.set_up_color_picker(current_color_1, button_1, 'monolith');
        let pickr_bot = this.set_up_color_picker(current_color_2, button_2, 'monolith');
        let pickr_bg = this.set_up_color_picker(current_color_3, button_3, 'monolith');

        pickr_top.on('save', (color) => {
            if (!Array.isArray(this.dataModel.webpage.articles[this.articleIndex].background.color_gradient)) {
                this.dataModel.webpage.articles[this.articleIndex].background.color_gradient = ["transparent", "transparent"];
            }
            if (color !== null) {
                this.dataModel.webpage.articles[this.articleIndex].background.color_gradient[0] = color.toHEXA().toString();
            }
            else {
                this.dataModel.webpage.articles[this.articleIndex].background.color_gradient[0] = "transparent";
            }

            let color_1 = this.dataModel.webpage.articles[this.articleIndex].background.color_gradient[0];
            let color_2 = this.dataModel.webpage.articles[this.articleIndex].background.color_gradient[1];
            let image = this.dataModel.webpage.articles[this.articleIndex].background.image;
            ArticleBackgroundEditor.loadBackgroundColorGradient(this.article, color_1, color_2, image);
        });
        pickr_bot.on('save', (color) => {
            if (!Array.isArray(this.dataModel.webpage.articles[this.articleIndex].background.color_gradient)) {
                this.dataModel.webpage.articles[this.articleIndex].background.color_gradient = ["transparent", "transparent"];
            }
            if (color !== null) {
                this.dataModel.webpage.articles[this.articleIndex].background.color_gradient[1] = color.toHEXA().toString();
            }
            else {
                this.dataModel.webpage.articles[this.articleIndex].background.color_gradient[1] = "transparent";
            }

            let color_1 = this.dataModel.webpage.articles[this.articleIndex].background.color_gradient[0];
            let color_2 = this.dataModel.webpage.articles[this.articleIndex].background.color_gradient[1];
            let image = this.dataModel.webpage.articles[this.articleIndex].background.image;
            ArticleBackgroundEditor.loadBackgroundColorGradient(this.article, color_1, color_2, image);
        });
        pickr_bg.on('save', (color) => {
            if (color !== null) {
                color = color.toHEXA().toString();
                this.dataModel.webpage.articles[this.articleIndex].background.color = color;
            }
            else {
                this.dataModel.webpage.articles[this.articleIndex].background.color = null;
            }

            ArticleBackgroundEditor.loadBackgroundColor(this.article, color);
        });

        return [div_1, div_2, div_3];
    }

    set_up_color_picker(color, button, theme) {
        const pickr = Pickr.create({
            el: button,
            theme: theme, // or 'monolith', or 'nano'
            default: color,     // Set to existing value for bg color.
            swatches: [             // Set to colors used in the theme of the page.
                'rgba(244, 67, 54, 1)',
                'rgba(233, 30, 99, 0.95)',
                'rgba(156, 39, 176, 0.9)',
                'rgba(103, 58, 183, 0.85)',
                'rgba(63, 81, 181, 0.8)',
                'rgba(33, 150, 243, 0.75)',
                'rgba(3, 169, 244, 0.7)',
                'rgba(0, 188, 212, 0.7)',
                'rgba(0, 150, 136, 0.75)',
                'rgba(76, 175, 80, 0.8)',
                'rgba(139, 195, 74, 0.85)',
                'rgba(205, 220, 57, 0.9)',
                'rgba(255, 235, 59, 0.95)',
                'rgba(255, 193, 7, 1)'
            ],
        
            components: {
        
                // Main components
                preview: true,
                opacity: true,
                hue: true,
        
                // Input / output Options
                interaction: {
                    hex: true,
                    rgba: true,
                    hsla: true,
                    hsva: true,
                    cmyk: true,
                    input: true,
                    clear: true,
                    save: true
                }
            }
        });
    
        return pickr;
    }

    removeFromDOM() {
        for (let container of this.buttonContainers) {
            container.remove();
        }
    }

    _resetInstanceVariables() {

    }
}