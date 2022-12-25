class StickyNote {
    static enableEditMode(sticky_note, data_model, article_index, sticky_note_index) {
        // Makes heading and paragraph editable.
        let subheading = sticky_note.querySelector(".article-subheading");
        Article.makeSubHeadingEditable(data_model, subheading, article_index, sticky_note_index);
        let text = sticky_note.querySelector(".text-container .article-text");
        Article.makeTextEditable(data_model, text, article_index, sticky_note_index);

        // Makes links editable
        Article.makeLinkEditable(data_model, sticky_note, article_index, sticky_note_index);
        let link_section = sticky_note.querySelector(".text-container");
        Article.installAddNewLinkButton(data_model, link_section, article_index, sticky_note_index);

        // Handles deleting the sticky note
        StickyNote.makeStickyNoteDeletable(data_model, sticky_note, article_index, sticky_note_index);
    }

    static makeStickyNoteDeletable(data_model, sticky_note, article_index, card_index) {
        new DeleteStickyNoteButton(data_model, article_index, card_index).install(sticky_note, sticky_note);
    }

    constructor(data_model) {
        this.dataModel = data_model;

        this.parentContainer = null;
        this.stickyNote = null;
    }

    install(parent_container, subheading, texts, links) {
        if (!parent_container) {
            throw "StickyNote: You must provide a div to install the sticky note into.";
        }
        this.parentContainer = parent_container;

        let sticky_note = this.render(subheading, texts, links);
        this.addToDOM(sticky_note, parent_container);
    }

    render(heading = "Sticky Note", texts = ["Enter text here"], links = []) {        
        let h2 = Util.tag('h2', {'class': "article-subheading"}, heading);
        let div_1 = Util.tag('div', {'class': "heading-container"}, h2);

        let p = Util.tag('p', {'class': 'article-text'}, texts[0]);
        for (let i = 1; i < texts.length; i++) {
            p.innerHTML += "<br>";
            p.innerHTML += texts[i];
        }
        let text_container = Util.tag('div', {'class': "text-container"}, [div_1, p]);
        for (let link of links) {
            let link_button = new LinkButton();
            link_button.install(text_container, link["text"], link["url"]);
        }

        let sticky_note = Util.tag('div', {'class': "sticky-note"}, [text_container]);
        this.stickyNote = sticky_note;
        return sticky_note;
    }

    addToDOM(sticky_note, parent_container) {
        let add_sticky_note_button = parent_container.querySelector(".add-sticky-note-button");
        if (add_sticky_note_button) { // This is for adding a new sticky note while editing.
            this.addBefore(sticky_note, add_sticky_note_button); // We add before so that the new sticky note does not end up after the add new sticky note button.
        } else { // This is for initial loading of webpage.
            this.append(sticky_note, parent_container);
        }
    }

    append(sticky_note, parent_container) {
        if (sticky_note instanceof Array) {
            for (let elem of sticky_note) {
                parent_container.append(elem);
            }
        } else {
            parent_container.append(sticky_note);
        }
    }

    addBefore(sticky_note, add_sticky_note_button) {
        if (sticky_note instanceof Array) {
            for (let elem of sticky_note) {
                add_sticky_note_button.before(elem);
            }
        } else {
            add_sticky_note_button.before(sticky_note);
        }
    }

    _resetInstanceVariables() {

    }
}