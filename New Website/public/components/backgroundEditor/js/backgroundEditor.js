class BackgroundEditor {
    constructor(data_model) {
        this.parentContainer = null;
        this.dataModel = data_model;
    }

    install(parent_container) {
        if (!parent_container) {
            throw "Background Editor: You must provide a div to install the Background Editor into.";
        }
        this.parentContainer = parent_container;

        let editor = this.render();
        this.addToDOM(editor, parent_container);
    }


    render(class_name = "") {    
        let button_container = Util.tag('div', {'class': `bg-button-container`}, "");
        let body = document.querySelector("body");
        let vid_tag = document.querySelector("#page-background-video");
        let vid_src_tag = document.querySelector("#page-background-video source");
        new AddBackgroundImageButton(this.dataModel).install(button_container, body, vid_tag, vid_src_tag);
        new AddBackgroundVideoButton(this.dataModel).install(button_container, body, vid_tag, vid_src_tag);
        new AddBackgroundColorButton(this.dataModel).install(button_container, body);

        let editor = Util.tag('div', {'class': `bg-button-container-wrapper ${class_name}`}, button_container, false);
        this.editor = editor;
        return editor;
    }

    addToDOM(editor, parentContainer) {
        if (editor instanceof Array) {
            for (let elem of editor) {
                parentContainer.append(elem);
            }
        } else {
            parentContainer.append(editor);
        }
    }


    removeFromDOM() {
        this.editor.remove();
    }


    _resetInstanceVariables() {
        this.parentContainer = null;
        this.editor = null;
    }
}