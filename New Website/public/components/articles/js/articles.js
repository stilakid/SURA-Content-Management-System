/**
 */

class Article {
    static async enterArticlesEditMode(parent_container, data_model, container_is_article = false) {
        if (container_is_article) {
            await Article.enterArticleEditMode(parent_container, data_model);
        } else {    // IMPORTANT: We assume the else statement is triggered first and only once for any given container. Then, the rest of the newly created articles use the if statement.
            let articles = parent_container.querySelectorAll(".article");
            for (let article of articles) {
                await Article.enterArticleEditMode(article, data_model);
            }
            if (articles.length > 0) {
                new NewSectionButton(data_model).installAfter(articles[articles.length - 1]);
            } else {
                new NewSectionButton(data_model).installInto(parent_container);
            }
        }
    }

    // TODO: For arrows that allow you to rearrange the order of the articles, when you press the buttons, 
    // move the articles in the dom but not the article data in the dataModel. If we move the article data in the dataModel,
    // we will have to correct the index in all the event listeners of the moved articles. So, what we will do instead is
    // record the changes in article arrangement in the this.articleArrangement array of dataModel and apply the changes when we
    // post to the server.
    static async enterArticleEditMode(parent_container, data_model) {
        let article_id = parent_container.id;
        let index = Util.getArticleIndex(article_id, data_model.webpage.articles);
        
        // *****************

        // Edit Texts

        Article.makeHeadingEditable(data_model, parent_container, index);
        Article.makeSubHeadingsEditable(data_model, parent_container, index);
        Article.makeTextsEditable(data_model, parent_container, index);
        
        // *****************

        // Edit Links
        await Article.makeLinksEditable(data_model, parent_container, index);
        Article.installAddNewLinkButtons(data_model, parent_container, index);

        // *****************

        // Need to update db now for images
        let image_containers = parent_container.querySelectorAll('.image-container');
        for (let i = 0; i < image_containers.length; i++) {
            let img = image_containers[i].querySelector('.image');
            if (!img) {
                let add_image_button = new AddImageButton(data_model, index, i);
                add_image_button.install(image_containers[i]);
            } else {
                AddImageButton.addDeleteImageButton(image_containers[i], img, data_model, index, i);
            }
        }

        // *****************

        // Template 11 Specific: Add " Add Member Button + Delete Member Buttons + Add/Delete Member Photo Buttons"
        let team_members = parent_container.querySelectorAll('.team-member');
        for (let i = 0; i < team_members.length; i++) {
            MemberCard.makeMemberPhotosEditable(data_model, team_members[i], index, i);
            MemberCard.makeMemberDeletable(data_model, team_members[i], index, i);
        }

        let team_members_containers = parent_container.querySelectorAll(".team-members");
        for (let container of team_members_containers) {
            new AddNewMemberButton(data_model, index).install(container);
        }

        // *****************

        // Template 12 Specific: Add " Add Sticky Note Button + Delete Sticky Note Buttons"
        let sticky_notes = parent_container.querySelectorAll('.sticky-note');
        for (let i = 0; i < sticky_notes.length; i++) {
            StickyNote.makeStickyNoteDeletable(data_model, sticky_notes[i], index, i);
        }

        let sticky_note_containers = parent_container.querySelectorAll(".sticky-notes");
        for (let container of sticky_note_containers) {
            new AddNewStickyNoteButton(data_model, index).install(container);
        }

        // *****************

        // Template 13 Specifc: Add "Add Slide Button + Delete Slide Buttons + Set Slide Height"
        let slides = parent_container.querySelectorAll('.slide');
        for (let i = 0; i < slides.length; i++) {
            Slide.makeSlideDeletable(data_model, slides[i], index, i);
            let subheading = slides[i].querySelector('.article-subheading');
            let text = slides[i].querySelector('.article-text');
            let slide_info = slides[i].querySelector('.slide-info');
            Slide.setBackgroundColorConditions(subheading, text, slide_info);
        }

        let slide_containers = parent_container.querySelectorAll('.slides');
        for (let container of slide_containers) {
            new AddNewSlideButton(data_model, index).install(container);
        }

        let slide_components_container = parent_container.querySelector('.slide_components_container');
        if (slide_components_container) {
            Slide.installSizeAdjuster(data_model, index, slide_components_container);
        }



        
        // *****************

        // Add Section edit buttons
        new ArticleEditButtons(data_model, index, article_id).install(parent_container);

        //  Add 'New Section' Buttons before the article
        new NewSectionButton(data_model).installBefore(parent_container);
    }


    static makeHeadingEditable(data_model, parent_container, index) {
        let heading = parent_container.querySelector(".article-title");
        if (!heading) return;
        heading.setAttribute("contenteditable", "true");
        heading.addEventListener("input", () => {
            data_model.webpage.articles[index].heading = heading.textContent;
        });
    }

    static makeSubHeadingsEditable(data_model, parent_container, index) {
        let subheadings = parent_container.querySelectorAll('.article-subheading');
        for (let i = 0; i < subheadings.length; i++) {
            Article.makeSubHeadingEditable(data_model, subheadings[i], index, i);
        }
    }

    static makeSubHeadingEditable(data_model, subheading, article_index, subheading_index) {
        subheading.setAttribute("contenteditable", "true");
        subheading.addEventListener("input", () => {
            data_model.webpage.articles[article_index].subheadings[subheading_index] = subheading.textContent;
        });
    }

    static makeTextsEditable(data_model, parent_container, index) {
        let editable_texts = parent_container.querySelectorAll('.text-container p');
        for (let i = 0; i < editable_texts.length; i++) {
            Article.makeTextEditable(data_model, editable_texts[i], index, i);
        }
    }

    static makeTextEditable(data_model, text, article_index, text_index) {
        let textarea = Util.tag('textarea', {'contenteditable': 'true', 'class': 'article-text'}, "");
        textarea.innerHTML = text.innerText;
        text.replaceWith(textarea);
        textarea.addEventListener("input", () => {
            let text_value = textarea.value.split(/\n/g);
            data_model.webpage.articles[article_index].texts[text_index] = text_value;
        });
    }

    static async makeLinksEditable(data_model, parent_container, index) {
        let text_containers = parent_container.querySelectorAll('.text-container');
        for (let i = 0; i < text_containers.length; i++) {
            await Article.makeLinkEditable(data_model, text_containers[i], index, i);
        }
    }

    static async makeLinkEditable(data_model, link_section, article_index, link_section_index) {
        let link_buttons = link_section.querySelectorAll(".link-button");
        for (let j = 0; j < link_buttons.length; j++) {
            let link = link_buttons[j].querySelector("a");
            let text = link.textContent;
            let url = link.href;
            await new LinkButton(data_model, article_index, link_section_index, j).install(link_buttons[j].parentElement, text, url, true);
            link_buttons[j].remove();
        }
    }

    static installAddNewLinkButtons(data_model, parent_container, index) {
        let text_containers = parent_container.querySelectorAll('.text-container');

        for (let i = 0; i < text_containers.length; i++) {
            Article.installAddNewLinkButton(data_model, text_containers[i], index, i);
        }
    }

    static installAddNewLinkButton(data_model, link_section, article_index, link_section_index) {
        let button = new AddLinkButton(data_model, article_index, link_section_index);
        button.install(link_section);
    }

    static getGenericArticleData(template) {
        let article_data = {};

        article_data.article_id = Util.generateUniqueID();
        article_data.template = template;
        article_data.heading = "Heading Goes Here";
        article_data.images = [];
        article_data.videos = [];
        article_data.background = {
            'image': null,
            'color': null,
            'color_gradient': null
        };
        article_data.component_backgrounds = [];

        if (template === "template-12" || template === "template-11") {
            article_data.subheadings = [];
            article_data.texts = [];
            article_data.links = [];
        } else {
            article_data.subheadings = ["Enter Secondary Heading", "Enter Secondary Heading"];
            article_data.texts = [['Enter text here'], ['Enter text here']];
            article_data.links = [[], []];
        }

        return article_data;
    }

    // <div id="curved-foreground"></div>
    static renderSignaturetArticle() {
        let article = Util.tag('div', {'id': "curved-foreground"}, "");
        return article;
    }

    static addDividingBar(elem, addInto=true, addAfter=false, addBefore=false) {
        if (!elem) {
            throw "You must provide an elem relative to which you want to add the article dividing bar."
        }
        let bar = Util.tag('article', {'class': "pre-article"}, "");
        if (addInto) {
            elem.append(bar);
        } else if (addAfter) {
            elem.after(bar);
        } else if (addBefore) {
            elem.before(bar);
        }
    }

    static afterLoadingTemplateThirteen(article, images) {
        // Resize the slides
        let slide_components_container = article.querySelector('.slide_components_container');
        if (images.length > 0) {
            if (images[0].width) { // if aspect ratio data was given
                let new_height = Util.findEquivalentHeight(slide_components_container, images[0].width, images[0].height);
                slide_components_container.style.height = `${new_height}px`;
            } else { // default is 1:1 aspect ratio
                let new_height = Util.findEquivalentHeight(slide_components_container, 1, 1);
                slide_components_container.style.height = `${new_height}px`;
            }
        }
    }

    static addArticleBackground(article, background_data) {
        if (background_data.image && background_data.color_gradient) {
            let color_1 = background_data.color_gradient[0];
            let color_2 = background_data.color_gradient[1];
            article.style.backgroundImage = `linear-gradient(${color_1}, ${color_2}), url(${Util.encodeUriAll(background_data.image)})`;
        } else if (background_data.image) {
            article.style.backgroundImage = `url(${Util.encodeUriAll(background_data.image)})`;
        } else if (background_data.color_gradient) {
            let color_1 = background_data.color_gradient[0];
            let color_2 = background_data.color_gradient[1];
            article.style.backgroundImage = `linear-gradient(${color_1}, ${color_2})`;
        }
        
        if (background_data.color) {
            article.style.backgroundColor = background_data.color;
        } else {
            article.style.backgroundColor = `var(--tertiary-color-light)`;
        }
    }

    constructor(data_model) {
        this.dataModel = data_model;
        this.webpageData = data_model.webpage;
        this.parentContainer = null;
        this.article = null;
    }

    // Install an article. Used for rendering existing articles.
    install(parent_container, article_data, edit_mode = false) {
        if (!parent_container) {
            throw "Article: You must provide a div to install the article into.";
        }
        this.parentContainer = parent_container;
        if (edit_mode) {
            this.enterEditMode(this.parentContainer);
        }

        let article = this.render(article_data);
        this.addToDOM(article, parent_container);
    }

    // Insert a new article. Used for rendering a newly created article.
    insert(elem_after_article, article_data, edit_mode = true) {
        if (!elem_after_article) {
            throw "Article: You must provide an element before which you want to install the article.";
        }

        // Adds article data to the data model
        this.dataModel.webpage.articles.push(article_data);
        
        // Add the article inside the DOM.
        let article = this.render(article_data);
        elem_after_article.before(article);
        if (edit_mode) {
            this.enterEditMode(article);
        }

        // Updates the article arrangement array in data model
        let articles = elem_after_article.parentElement.querySelectorAll(".article");
        let index = 0;
        for (let i = 0; i < articles.length; i++) {
            if (articles[i].id === article_data.article_id) {
                index = i;
                break;
            }
        }
        this.dataModel.articleArrangement.splice(index, 0, article_data.article_id);
    }

    render(article_data) {
        this.article = this.renderArticle(article_data);
        return this.article;
    }


    renderArticle(article_data) {
        switch(article_data.template) {
            case "template-1":
                return this.renderArticleTemplateOne(article_data.article_id, article_data.template, article_data.background, article_data.heading, article_data.texts, article_data.links);
            case "template-2":
                return this.renderArticleTemplateTwo(article_data.article_id, article_data.template, article_data.background, article_data.heading, article_data.texts, article_data.links, article_data.images);
            case "template-3":
                return this.renderArticleTemplateThree(article_data.article_id, article_data.template, article_data.background, article_data.heading, article_data.texts, article_data.links, article_data.images);
            case "template-4":
                return this.renderArticleTemplateFour(article_data.article_id, article_data.template, article_data.background, article_data.heading, article_data.subheadings, article_data.texts, article_data.links, article_data.images);
            case "template-5":
                return this.renderArticleTemplateFive(article_data.article_id, article_data.template, article_data.background, article_data.heading, article_data.subheadings, article_data.texts, article_data.links, article_data.images);
            case "template-6":
                return this.renderArticleTemplateSix(article_data.article_id, article_data.template, article_data.background, article_data.heading, article_data.subheadings, article_data.texts, article_data.links, article_data.images);
            case "template-7":
                return this.renderArticleTemplateSeven(article_data.article_id, article_data.template, article_data.background, article_data.heading, article_data.subheadings, article_data.texts, article_data.links, article_data.images);
            case "template-8":
                return this.renderArticleTemplateEight(article_data.article_id, article_data.template, article_data.background, article_data.heading, article_data.subheadings, article_data.texts, article_data.links, article_data.images);
            case "template-9":
                return this.renderArticleTemplateNine(article_data.article_id, article_data.template, article_data.background, article_data.heading, article_data.subheadings, article_data.texts, article_data.links, article_data.images);
            case "template-10":
                return this.renderArticleTemplateTen(article_data.article_id, article_data.template, article_data.background, article_data.heading, article_data.subheadings, article_data.texts, article_data.links, article_data.images);
            case "template-11":
                return this.renderArticleTemplateEleven(article_data.article_id, article_data.template, article_data.background, article_data.heading, article_data.subheadings, article_data.texts, article_data.links, article_data.images);
            case "template-12":
                return this.renderArticleTemplateTwelve(article_data.article_id, article_data.template, article_data.background, article_data.heading, article_data.subheadings, article_data.texts, article_data.links);
            case "template-13":
                return this.renderArticleTemplateThirteen(article_data.article_id, article_data.template, article_data.background, article_data.heading, article_data.subheadings, article_data.texts, article_data.links, article_data.images);
            default:
                throw "Articles: Specified article template does not exist.";
        }
    }


    /**
     * 
     * @param {*} id 
     * @param {*} template 
     * @param {*} heading 
     * @param {*} texts 
     * @param {*} links 
     * @returns 
     */
    renderArticleTemplateOne(id, template = "template-1", background = null, heading = "Heading Goes Here", texts = [['Enter text here']], links = [[]]) {
        let h1 = Util.tag('h1', {'class': 'article-title'}, heading);

        let p = Util.tag('p', {'class': 'article-text'}, texts[0][0]);
        for (let i = 1; i < texts[0].length; i++) {
            p.innerHTML += "<br>";
            p.innerHTML += texts[0][i];
        }
        
        let div = Util.tag('div', {'class': 'text-container'}, p);
        for (let link of links[0]) {
            let link_button = new LinkButton();
            link_button.install(div, link["text"], link["url"]);
        }

        let article = Util.tag('article', {'class': `article ${template}`}, [h1, div]);
        if (id) {
            article.id = id;
        } else {
            article.id = Util.generateUniqueID();
        }
        Article.addArticleBackground(article, background);

        return article;
    }


    // Heading, Image, and Text | Img on the right
    renderArticleTemplateTwo(id, template = "template-2", background = null, heading = "Heading Goes Here", texts = [['Enter text here']], links = [[]], images = []) {
        let h1 = Util.tag('h1', {'class': 'article-title'}, heading);

        let p = Util.tag('p', {'class': 'article-text'}, texts[0][0]);
        for (let i = 1; i < texts[0].length; i++) {
            p.innerHTML += "<br>";
            p.innerHTML += texts[0][i];
        }

        let div_1 = Util.tag('div', {'class': 'text-container'}, p);
        for (let link of links[0]) {
            let link_button = new LinkButton();
            link_button.install(div_1, link["text"], link["url"]);
        }

        let div_2 = Util.tag('div', {'class': 'image-container'}, "");
        if (images[0]) {
            AddImageButton.loadImage(div_2, images[0]);
        }

        let div = Util.tag('div', {'class': 'article-body'}, [div_1, div_2]);
        let article = Util.tag('article', {'class': `article ${template}`}, [h1, div]);
        if (id) {
            article.id = id;
        } else {
            article.id = Util.generateUniqueID();
        }
        Article.addArticleBackground(article, background);

        return article;
    }


    renderArticleTemplateThree(id, template = "template-3", background = null, heading = "Heading Goes Here", texts = [['Enter text here']], links = [[]], images = []) { 
        let h1 = Util.tag('h1', {'class': 'article-title'}, heading);

        let p = Util.tag('p', {'class': 'article-text'}, texts[0][0]);
        for (let i = 1; i < texts[0].length; i++) {
            p.innerHTML += "<br>";
            p.innerHTML += texts[0][i];
        }

        let div_1 = Util.tag('div', {'class': 'image-container'}, "");
        if (images[0]) {
            AddImageButton.loadImage(div_1, images[0]);
        }

        let div_2 = Util.tag('div', {'class': 'text-container'}, p);
        for (let link of links[0]) {
            let link_button = new LinkButton();
            link_button.install(div_2, link["text"], link["url"]);
        }

        let div = Util.tag('div', {'class': 'article-body'}, [div_1, div_2]);
        let article = Util.tag('article', {'class': `article ${template}`}, [h1, div]);
        if (id) {
            article.id = id;
        } else {
            article.id = Util.generateUniqueID();
        }
        Article.addArticleBackground(article, background);
        
        return article;
    }


    renderArticleTemplateFour(id, template = "template-4", background = null, heading = "Heading Goes Here", subheadings = ["Enter Secondary Heading"], texts = [['Enter text here']], links = [[]], images = []) {
        let h1 = Util.tag('h1', {'class': 'article-title'}, heading);

        let h2 = Util.tag('h2', {'class': 'article-subheading'}, subheadings[0]);

        let p = Util.tag('p', {'class': 'article-text'}, texts[0][0]);
        for (let i = 1; i < texts[0].length; i++) {
            p.innerHTML += "<br>";
            p.innerHTML += texts[0][i];
        }

        let div_1_1 = Util.tag('div', {'class': 'text-container'}, [h2, p]);
        for (let link of links[0]) {
            let link_button = new LinkButton();
            link_button.install(div_1_1, link["text"], link["url"]);
        }

        let div_1_2 = Util.tag('div', {'class': 'image-container'}, "");
        if (images[0]) {
            AddImageButton.loadImage(div_1_2, images[0]);
        }


        let div_1 = Util.tag('div', {'class': 'has-background-horizontal'}, [div_1_1, div_1_2]);

        let div = Util.tag('div', {'class': 'article-body'}, div_1);
        let article = Util.tag('article', {'class': `article ${template}`}, [h1, div]);
        if (id) {
            article.id = id;
        } else {
            article.id = Util.generateUniqueID();
        }
        Article.addArticleBackground(article, background);

        return article;
    }


    renderArticleTemplateFive(id, template = "template-5", background = null, heading = "Heading Goes Here", subheadings = ["Enter Secondary Heading"], texts = [['Enter text here']], links = [[]], images = []) {
        let h1 = Util.tag('h1', {'class': 'article-title'}, heading);

        let h2 = Util.tag('h2', {'class': 'article-subheading'}, subheadings[0]);

        let p = Util.tag('p', {'class': 'article-text'}, texts[0][0]);
        for (let i = 1; i < texts[0].length; i++) {
            p.innerHTML += "<br>";
            p.innerHTML += texts[0][i];
        }

        let div_1_1 = Util.tag('div', {'class': 'image-container'}, "");
        if (images[0]) {
            AddImageButton.loadImage(div_1_1, images[0]);
        }

        let div_1_2 = Util.tag('div', {'class': 'text-container'}, [h2, p]);
        for (let link of links[0]) {
            let link_button = new LinkButton();
            link_button.install(div_1_2, link["text"], link["url"]);
        }

        let div_1 = Util.tag('div', {'class': 'has-background-horizontal'}, [div_1_1, div_1_2]);

        let div = Util.tag('div', {'class': 'article-body'}, div_1);
        let article = Util.tag('article', {'class': `article ${template}`}, [h1, div]);
        if (id) {
            article.id = id;
        } else {
            article.id = Util.generateUniqueID();
        }
        Article.addArticleBackground(article, background);

        return article;
    }


    
    renderArticleTemplateSix(id, template = "template-6", background = null, heading = "Heading Goes Here", subheadings = ["Enter Secondary Heading"], texts = [['Enter text here']], links = [[]], images = []) {
        let h1 = Util.tag('h1', {'class': 'article-title'}, heading);


        let div_1_1 = Util.tag('div', {'class': 'image-container'}, "");
        if (images[0]) {
            AddImageButton.loadImage(div_1_1, images[0]);
        }

        let h2_1 = Util.tag('h2', {'class': 'article-subheading'}, subheadings[0]);

        let p_1 = Util.tag('p', {'class': 'article-text'}, texts[0][0]);
        for (let i = 1; i < texts[0].length; i++) {
            p_1.innerHTML += "<br>";
            p_1.innerHTML += texts[0][i];
        }
        let div_1_2 = Util.tag('div', {'class': 'text-container'}, [h2_1, p_1]);
        for (let link of links[0]) {
            let link_button = new LinkButton();
            link_button.install(div_1_2, link["text"], link["url"]);
        }

        let div_1 = Util.tag('div', {'class': 'section'}, [div_1_1, div_1_2]);




        let div_2_1 = Util.tag('div', {'class': 'image-container'}, "");
        if (images[1]) {
            AddImageButton.loadImage(div_2_1, images[1]);
        }

        let h2_2 = Util.tag('h2', {'class': 'article-subheading'}, subheadings[1]);

        let p_2 = Util.tag('p', {'class': 'article-text'}, texts[1][0]);
        for (let i = 1; i < texts[1].length; i++) {
            p_2.innerHTML += "<br>";
            p_2.innerHTML += texts[1][i];
        }
        let div_2_2 = Util.tag('div', {'class': 'text-container'}, [h2_2, p_2]);
        for (let link of links[1]) {
            let link_button = new LinkButton();
            link_button.install(div_2_2, link["text"], link["url"]);
        }

        let div_2 = Util.tag('div', {'class': 'section'}, [div_2_1, div_2_2]);


        


        let div = Util.tag('div', {'class': 'article-body'}, [div_1, div_2]);
        let article = Util.tag('article', {'class': `article ${template}`}, [h1, div]);
        if (id) {
            article.id = id;
        } else {
            article.id = Util.generateUniqueID();
        }
        Article.addArticleBackground(article, background);

        return article;
    }


    renderArticleTemplateSeven(id, template = "template-7", background = null, heading = "Heading Goes Here", subheadings = ["Enter Secondary Heading"], texts = [['Enter text here']], links = [[]], images = []) {
        let h1 = Util.tag('h1', {'class': 'article-title'}, heading);


        let div_1_1 = Util.tag('div', {'class': 'image-container'}, "");
        if (images[0]) {
            AddImageButton.loadImage(div_1_1, images[0]);
        }

        let h2_1 = Util.tag('h2', {'class': 'article-subheading'}, subheadings[0]);

        let p_1 = Util.tag('p', {'class': 'article-text'}, texts[0][0]);
        for (let i = 1; i < texts[0].length; i++) {
            p_1.innerHTML += "<br>";
            p_1.innerHTML += texts[0][i];
        }
        let div_1_2 = Util.tag('div', {'class': 'text-container'}, [h2_1, p_1]);
        for (let link of links[0]) {
            let link_button = new LinkButton();
            link_button.install(div_1_2, link["text"], link["url"]);
        }

        let bg_div_1 = Util.tag('div', {'class': 'has-background-vertical'}, [div_1_1, div_1_2]);
        let div_1 = Util.tag('div', {'class': 'section'}, bg_div_1);



        let div_2_1 = Util.tag('div', {'class': 'image-container'}, "");
        if (images[1]) {
            AddImageButton.loadImage(div_2_1, images[1]);
        }

        let h2_2 = Util.tag('h2', {'class': 'article-subheading'}, subheadings[1]);

        let p_2 = Util.tag('p', {'class': 'article-text'}, texts[1][0]);
        for (let i = 1; i < texts[1].length; i++) {
            p_2.innerHTML += "<br>";
            p_2.innerHTML += texts[1][i];
        }
        let div_2_2 = Util.tag('div', {'class': 'text-container'}, [h2_2, p_2]);
        for (let link of links[1]) {
            let link_button = new LinkButton();
            link_button.install(div_2_2, link["text"], link["url"]);
        }

        let bg_div_2 = Util.tag('div', {'class': 'has-background-vertical'}, [div_2_1, div_2_2]);
        let div_2 = Util.tag('div', {'class': 'section'}, bg_div_2);



        let div = Util.tag('div', {'class': 'article-body'}, [div_1, div_2]);
        let article = Util.tag('article', {'class': `article ${template}`}, [h1, div]);
        if (id) {
            article.id = id;
        } else {
            article.id = Util.generateUniqueID();
        }
        Article.addArticleBackground(article, background);

        return article;
    }


    renderArticleTemplateEight(id, template = "template-8", background = null, heading = "Heading Goes Here", subheadings = ["Enter Secondary Heading"], texts = [['Enter text here']], links = [[]], images = []) {
        return this.renderArticleTemplateSix(id, template, background, heading, subheadings, texts, links, images);
    }


    renderArticleTemplateNine(id, template = "template-9", background = null, heading = "Heading Goes Here", subheadings = ["Enter Secondary Heading"], texts = [['Enter text here']], links = [[]], images = []) {
        return this.renderArticleTemplateSeven(id, template, background, heading, subheadings, texts, links, images);
    }


    renderArticleTemplateTen(id, template = "template-10", background = null, heading = "Heading Goes Here", subheadings = ["Enter Secondary Heading"], texts = [['Enter text here']], links = [[]], images = []) {
        let h1 = Util.tag('h1', {'class': 'article-title'}, heading);


        let h2 = Util.tag('h2', {'class': 'article-subheading'}, subheadings[0]);
        let p = Util.tag('p', {'class': 'article-text'}, texts[0][0]);
        for (let i = 1; i < texts[0].length; i++) {
            p.innerHTML += "<br>";
            p.innerHTML += texts[0][i];
        }
        let div_1_1 = Util.tag('div', {'class': 'text-container'}, [h2, p]);
        for (let link of links[0]) {
            let link_button = new LinkButton();
            link_button.install(div_1_1, link["text"], link["url"]);
        }
        let bg_div = Util.tag('div', {'class': 'has-background'}, div_1_1);
        let div_1 = Util.tag('div', {'class': 'text-card'}, bg_div);


        let div_2 = Util.tag('div', {'class': 'image-container image-card'}, "");
        if (images[0]) {
            AddImageButton.loadImage(div_2, images[0]);
        }


        let div = Util.tag('div', {'class': 'article-body'}, [div_1, div_2]);
        let article = Util.tag('article', {'class': `article ${template}`}, [h1, div]);
        if (id) {
            article.id = id;
        } else {
            article.id = Util.generateUniqueID();
        }
        Article.addArticleBackground(article, background);

        return article;
    }



    renderArticleTemplateEleven(id, template = "template-11", background = null, heading = "Heading Goes Here", subheadings = ["Name/Title"], texts = [['More Info']], links = [[]], images = []) {
        let h1 = Util.tag('h1', {'class': 'article-title'}, heading);
        let div = Util.tag('div', {'class': 'article-body team-members many-images'}, "");

        // We could have iterated by images, texts, or subheadings.
        // Texts and subheadings however have hardcoded values in generic article data. Only images is an empty array.
        // So, we iterate by images.
        for (let i = 0; i < images.length; i++) {
            new MemberCard(this.dataModel).install(div, subheadings[i], texts[i], images[i], links[i]);
        }

        let article = Util.tag('article', {'class': `article ${template}`}, [h1, div]);
        if (id) {
            article.id = id;
        } else {
            article.id = Util.generateUniqueID();
        }
        Article.addArticleBackground(article, background);

        return article;
    }
    

    renderArticleTemplateTwelve(id, template = "template-12", background = null, heading = "Heading Goes Here", subheadings = ["Sticky Note"], texts = [['Enter text here']], links = [[]]) {
        let h1 = Util.tag('h1', {'class': 'article-title'}, heading);
        let div = Util.tag('div', {'class': 'article-body sticky-notes'}, "");

        for (let i = 0; i < subheadings.length; i++) {
            new StickyNote(this.dataModel).install(div, subheadings[i], texts[i], links[i]);
        }

        let article = Util.tag('article', {'class': `article ${template}`}, [h1, div]);
        if (id) {
            article.id = id;
        } else {
            article.id = Util.generateUniqueID();
        }
        Article.addArticleBackground(article, background);

        return article;
    }

    
    renderArticleTemplateThirteen(id, template = "template-13", background = null, heading = "Heading Goes Here", subheadings = ["Slide Title"], texts = [['More Info']], links = [[]], images = []) {
        let h1 = Util.tag('h1', {'class': 'article-title'}, heading);
        let slides_container = Util.tag('div', {'class': "slides"}, "");

        for (let i = 0; i < images.length; i++) {
            new Slide(this.dataModel, id).install(slides_container, images[i], subheadings[i], texts[i], links[i]);
        }

        let slide_components_container = Util.tag('div', {'class': "slide_components_container"}, slides_container);
        new SlideButton(this.dataModel, id).install(slide_components_container);
        
        // let indicators = [];
        // for (let image of images) {
        //     let indicator = Util.tag('p', {}, );
        //     indicators.push(indicator);
        // }
        // let indicator_container = Util.tag('div', {'class': "indicator"}, indicators);


        let article = Util.tag('article', {'class': `article ${template}`}, [h1, slide_components_container]);
        if (id) {
            article.id = id;
        } else {
            article.id = Util.generateUniqueID();
        }
        Article.addArticleBackground(article, background);

        return article;
    }



    async enterEditMode(article_or_container) {
        await Article.enterArticlesEditMode(article_or_container, this.dataModel, true);
    }

    addToDOM(articles, parentContainer) {
        parentContainer.append(articles);
    }


    removeFromDOM() {
        this.article.remove();
    }

    _resetInstanceVariables() {
        this.parentContainer = null;
    }
}





    // <article id="first-article" class="odd-article">
    //     <div class="border">
    //         <div class="line"></div>
    //         <div id="sura-logo-box"><img id="sura-logo" src="/images/sura_logo.png"></div>
    //         <div class="line"></div>
    //     </div>
        
    //     <div id="quote">
    //         <div>
    //             <h2><em>"Research is to see what everybody else has seen, and to think what nobody else has thought" </em></h2>
    //             <br>
    //             <h2 style="margin-left: 600px;"><em>- (Albert Szent-Gyorgi, Nobel Prize Recipient 1937)</em></h2>
    //         </div>
    //         <img class="img-1" src="/images/Albert.jpg" width="200px">
    //     </div>
    // </article>

    // static renderSignaturetArticle() {
        // let line_1 = Util.tag('div', {'class': "line"}, "");
        // let img_1 = Util.tag('img', {'id': "sura-logo", 'src': Util.suraLogoTransparent}, "");
        // let sura_logo_container = Util.tag('div', {'id': "sura-logo-box"}, img_1);
        // let line_2 = Util.tag('div', {'class': "line"}, "");
        // let arc = Util.tag('div', {'class': "border"}, [line_1, sura_logo_container, line_2]);

        // let em_1 = Util.tag('em', {}, "Research is to see what everybody else has seen, and to think what nobody else has thought");
        // let h2_1 = Util.tag('h2', {}, em_1);
        // let br = Util.tag('br', {}, "");
        // let em_2 = Util.tag('em', {}, "- (Albert Szent-Gyorgi, Nobel Prize Recipient 1937)");
        // let h2_2 = Util.tag('h2', {'style': "margin-left: 600px"}, em_2);

        // let div = Util.tag('div', {}, [h2_1, br, h2_2]);
        // let img_2 = Util.tag('img', {'class': "img-1", 'src': Util.albert, 'width': "200px"}, "");
        // let quote_container = Util.tag('div', {'id': "quote"}, [div, img_2]);

        // let article = Util.tag('article', {'id': "first-article", 'class': `article`}, [arc, quote_container]);
        // return article;
// }