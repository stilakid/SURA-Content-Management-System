class Slide {
    static enableEditMode(slide, data_model, article_index, slide_index) {
        // Makes heading and paragraph editable.
        let subheading = slide.querySelector(".article-subheading");
        Article.makeSubHeadingEditable(data_model, subheading, article_index, slide_index);
        let text = slide.querySelector(".text-container .article-text");
        Article.makeTextEditable(data_model, text, article_index, slide_index);
        let slide_info = slide.querySelector('.slide-info');
        Slide.setBackgroundColorConditions(subheading, text, slide_info);

        // Makes links editable
        Article.makeLinkEditable(data_model, slide, article_index, slide_index);
        let link_section = slide.querySelector(".text-container");
        Article.installAddNewLinkButton(data_model, link_section, article_index, slide_index);

        // Handles deleting the member card
        Slide.makeSlideDeletable(data_model, slide, article_index, slide_index);
    }

    static setBackgroundColorConditions(subheading, text, container) {
        console.log("setBG", subheading, text)
        subheading.addEventListener('input', () => {
            Slide.setBackgroundColor(subheading, text, container);
        });
        text.addEventListener('input', () => {
            Slide.setBackgroundColor(subheading, text, container);
        });
    }

    static setBackgroundColor(subheading, text, container) {
        if (subheading.textContent.length !== 0 || text.value.length !== 0) {
            container.style.backgroundColor = `var(--tertiary-color)`;
        } else {
            container.style.backgroundColor = `transparent`;
        }
    }

    static makeSlideDeletable(data_model, slide, article_index, slide_index) {
        new DeleteSlideButton(data_model, article_index, slide_index).install(slide, slide);
    }

    static installSizeAdjuster(data_model, article_index, slide_components_container) {
        // ******************************
        // Aspect Ratio
        // ******************************

        // dropdown
        let id = Util.generateUniqueID();
        let label = Util.tag('label', {'for': id}, "Aspect Ratio: ");
        let dropdown = Util.tag('select', {'name': id, 'id': id}, "");
        let aspect_ratios = [
            {'width': 1, 'height': 1},
            {'width': 2, 'height': 3},
            {'width': 3, 'height': 2},
            {'width': 4, 'height': 5},
            {'width': 5, 'height': 4},
            {'width': 9, 'height': 16},
            {'width': 16, 'height': 9},
            {'width': 10, 'height': 16},
            {'width': 16, 'height': 10},
            {'width': 16, 'height': 9},
        ];
        for (let aspect_ratio of aspect_ratios) {
            let option = Util.tag('option', {'value': JSON.stringify(aspect_ratio)}, `${aspect_ratio.width} x ${aspect_ratio.height}`);
            dropdown.append(option);
        }
        let div_1 = Util.tag('div', {}, [label, dropdown]);
        dropdown.addEventListener('change', (event) => {
            let value = JSON.parse(event.currentTarget.value);

            // Add transition for smoother resizing
            Slide._addTransition(slide_components_container);
            
            // Update DOM
            let new_height = Util.findEquivalentHeight(slide_components_container, value.width, value.height);
            slide_components_container.style.height = `${new_height}px`;

            // Update Data Model
            for (let i = 0; i < data_model.webpage.articles[article_index].images.length; i++) {
                data_model.webpage.articles[article_index].images[i].width = value.width;
                data_model.webpage.articles[article_index].images[i].height = value.height;
            }
        });

        // Get Current Image Size
        let div_2 = Util.tag('div', {'class': ""}, "");
        new GetAspectRatioButton(data_model).install(div_2, slide_components_container);

        let legend = Util.tag('legend', {}, "Aspect Ratio");

        let aspect_ratio_container = Util.tag('fieldset', {'class': 'aspect-ratio-container'}, [legend, div_1, div_2])

        // ******************************
        // Object fit: cover vs contain
        // ******************************
        let options = [["Contain", "contain"], ["Cover", "cover"]];
        let object_fit_container = Util.createRadioButtons(options, "Object Fit:");
        object_fit_container.classList.add("object-fit-container");
        let inputs = object_fit_container.querySelectorAll('input');

        // Set default radio button selection

        let obj_fit;
        if (data_model.webpage.articles[article_index].images.length !== 0) {
            obj_fit = data_model.webpage.articles[article_index].images[0].obj_fit;
        }

        if (obj_fit) {
            for (let input of inputs) {
                if (input.value == obj_fit) {
                    input.checked = "checked";
                }
            }
        } else {
            for (let input of inputs) {
                if (input.value == "cover") {
                    input.checked = "checked";
                    console.log(input);
                }
            }
        }

        for (let input of inputs) {
            input.addEventListener('change', (event) => {
                let value = event.currentTarget.value;
                console.log("value", value);

                // Update DOM
                let slides = slide_components_container.querySelectorAll('.slide');
                for (let slide of slides) {
                    slide.style.backgroundSize = value;
                }

                // Update Data Model
                for (let i = 0; i < data_model.webpage.articles[article_index].images.length; i++) {
                    data_model.webpage.articles[article_index].images[i].obj_fit = value;
                }
                console.log(data_model);
            });
        }
        
        // ******************************
        // ******************************

        let container = Util.tag('div', {'class': "slide-editor"}, [aspect_ratio_container, object_fit_container]);
        slide_components_container.before(container);
    }

    static _addTransition(slide_components_container) {
        console.log('fired');
        let slides = slide_components_container.querySelectorAll('.slide');
        let slide_containers = slide_components_container.querySelectorAll('.slides');
        for (let slide_container of slide_containers) {
            slide_container.style.transition = "all 0.75s";
        }
        for (let slide of slides) {
            slide.style.transition = "1s";
        }
        this.trasitionWasSet = true;
    }

    constructor(data_model) {
        this.dataModel = data_model;

        this.parentContainer = null;
        this.slide = null;
    }

    install(parent_container, image_data, subheading, texts, links) {
        if (!parent_container) {
            throw "Slide: You must provide a div to install the slide into.";
        }
        if (!image_data) {
            throw "Slide: You must provide an image for the slide"
        }
        this.parentContainer = parent_container;

        let slide = this.render(subheading, texts, image_data, links);
        this.addToDOM(slide, parent_container);
    }

    render(heading = "Slide Title", texts = ["More Info"], image_data, links = []) {
        let h2 = Util.tag('h2', {'class': "article-subheading"}, heading);

        let p = Util.tag('p', {'class': 'article-text'}, texts[0]);
        for (let i = 1; i < texts.length; i++) {
            p.innerHTML += "<br>";
            p.innerHTML += texts[i];
        }

        let slide_info = Util.tag('div', {'class': "slide-info text-container"}, [h2, p]);
        console.log('slide info', heading.length, texts.length, texts, texts[0].length, texts[0].length === 0, texts.length === 1);
        if (heading.length === 0 && (texts.length === 0 || (texts.length === 1 && texts[0].length === 0))) {
            slide_info.style.backgroundColor = `transparent`;
        } else {
            slide_info.style.backgroundColor = `var(--tertiary-color)`;
        }

        for (let link of links) {
            let link_button = new LinkButton();
            link_button.install(slide_info, link["text"], link["url"]);
        }
        let img_url = image_data.url;
        if (img_url.slice(0, 5) !== "data:") { // if it is a data uri, we do not want to encode it as it is alrady in the correct form. Encoding it causes errors.
            img_url = Util.encodeUriAll(image_data.url);
        }
        console.log(img_url);
        let div = Util.tag('div', {'class': "slide"}, [slide_info]);
        div.style.backgroundImage = `url(${img_url})`;
        if (image_data.obj_fit) {
            div.style.backgroundSize = image_data.obj_fit;
        }

        this.slide = div;
        return div;
    }

    addToDOM(slide, parent_container) {
        let add_slide_button_slide = parent_container.querySelector(".slide.add-slide-button-container");
        if (add_slide_button_slide) { // This is for adding a new slide while editing.
            this.addBefore(slide, add_slide_button_slide); // We add before so that the new slide does not end up after the add new slide button.
        } else { // This is for initial loading of webpage.
            this.append(slide, parent_container);
        }
    }

    append(slide, parent_container) {
        if (slide instanceof Array) {
            for (let elem of slide) {
                parent_container.append(elem);
            }
        } else {
            parent_container.append(slide);
        }
    }

    addBefore(slide, add_member_button) {
        if (slide instanceof Array) {
            for (let elem of slide) {
                add_member_button.before(elem);
            }
        } else {
            add_member_button.before(slide);
        }
    }

    _resetInstanceVariables() {

    }
}