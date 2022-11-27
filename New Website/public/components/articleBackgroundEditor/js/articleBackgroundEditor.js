class ArticleBackgroundEditor {
    static loadBackgroundImage(article, img_url, color_1, color_2) {
        article.style.backgroundImage = `linear-gradient(${color_1}, ${color_2}), url(${Util.encodeUriAll(img_url)})`;
    }

    static loadBackgroundColorGradient(article, color_1, color_2, image) {
        if (image !== "" && image) {
            article.style.backgroundImage = `linear-gradient(${color_1}, ${color_2}), url(${Util.encodeUriAll(image)})`;
        }
        // if bg video is present, it is handled by video tag. So, the bg-image property is the same as the case with only colors.
        else {
            article.style.backgroundImage = `linear-gradient(${color_1}, ${color_2})`;
        }
    }

    static loadBackgroundColor(article, color) {
        article.style.backgroundColor = color;
    }


    constructor(data_model, article_index) {
        this.parentContainer = null;
        this.dataModel = data_model;
        this.articleIndex = article_index;
        this.article = null;
    }

    install(parent_container, article) {
        if (!parent_container) {
            throw "Article Background Editor: You must provide a div to install the Article Background Editor into.";
        }
        if (!article) {
            throw "Article Background Editor: You must provide an article to link the Article Background Editor to.";
        }
        this.parentContainer = parent_container;
        this.article = article;

        let editor = this.render();
        this.addToDOM(editor, parent_container);
    }


    render(class_name = "") {
        let button_container = Util.tag('div', {'class': `article-bg-button-container`}, "");
        new AddArticleBackgroundImageButton(this.dataModel, this.articleIndex).install(button_container, this.article);
        new AddArticleBackgroundColorButton(this.dataModel, this.articleIndex).install(button_container, this.article);

        let editor = Util.tag('div', {'class': `article-bg-button-container-wrapper ${class_name}`}, button_container, false);
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