class MemberCard {
    // Here, image_index === subheading_index === link_section_index. So, we will use image_index in general for all three.
    static enableEditMode(member_card, data_model, article_index, card_index) {
        // Makes heading and paragraph editable.
        let subheading = member_card.querySelector(".article-subheading");
        Article.makeSubHeadingEditable(data_model, subheading, article_index, card_index);
        let text = member_card.querySelector(".text-container .article-text");
        Article.makeTextEditable(data_model, text, article_index, card_index);

        // Makes links editable
        Article.makeLinkEditable(data_model, member_card, article_index, card_index);
        let link_section = member_card.querySelector(".text-container");
        Article.installAddNewLinkButton(data_model, link_section, article_index, card_index);

        // Handles adding and deleting member photo
        MemberCard.makeMemberPhotosEditable(data_model, member_card, article_index, card_index);

        // Handles deleting the member card
        MemberCard.makeMemberDeletable(data_model, member_card, article_index, card_index);
    }

    static makeMemberPhotosEditable(data_model, member_card, article_index, card_index) {
        let img = member_card.querySelector('.image.member-photo');
        let img_container = member_card.querySelector('.member-photo-container');
        if (data_model.webpage.articles[article_index].images[card_index].url == Util.defaultMemberPhoto) {
            img.remove();
            let add_image_button = new AddMemberPhotoButton(data_model, article_index, card_index);
            add_image_button.install(img_container);
        } else {
            AddMemberPhotoButton.addDeleteImageButton(img_container, img, data_model, article_index, card_index);
        }
    }

    static makeMemberDeletable(data_model, member_card, article_index, card_index) {
        new DeleteMemberButton(data_model, article_index, card_index).install(member_card, member_card);
    }

    constructor(data_model) {
        this.dataModel = data_model;

        this.parentContainer = null;
        this.memberCard = null;

    }

    install(parent_container, subheading, texts, img_url, links) {
        if (!parent_container) {
            throw "MemberCard: You must provide a div to install the member card into.";
        }
        this.parentContainer = parent_container;

        let member_card = this.render(subheading, texts, img_url, links);
        this.addToDOM(member_card, parent_container);
    }

    render(heading = "Name/Title", texts = ["More Info"], img_url = Util.createImageData(Util.defaultMemberPhoto), links = []) {
        let img_container = Util.tag('div', {'class': "member-photo-container"}, "");
        AddMemberPhotoButton.loadImage(img_container, img_url);
        
        let h3 = Util.tag('h3', {'class': "article-subheading"}, heading);
        let p = Util.tag('p', {'class': 'article-text'}, texts[0]);
        for (let i = 1; i < texts.length; i++) {
            p.innerHTML += "<br>";
            p.innerHTML += texts[i];
        }
        let member_info = Util.tag('div', {'class': "member-info text-container"}, [h3, p]);
        for (let link of links) {
            let link_button = new LinkButton();
            link_button.install(member_info, link["text"], link["url"]);
        }

        let div = Util.tag('div', {'class': "team-member"}, [img_container, member_info]);
        this.memberCard = div;
        return div;
    }

    addToDOM(member_card, parent_container) {
        let add_member_button = parent_container.querySelector(".add-member-button");
        if (add_member_button) { // This is for adding a new member while editing.
            this.addBefore(member_card, add_member_button); // We add before so that the new member card does not end up after the add new member button.
        } else { // This is for initial loading of webpage.
            this.append(member_card, parent_container);
        }
    }

    append(member_card, parent_container) {
        if (member_card instanceof Array) {
            for (let elem of member_card) {
                parent_container.append(elem);
            }
        } else {
            parent_container.append(member_card);
        }
    }

    addBefore(member_card, add_member_button) {
        if (member_card instanceof Array) {
            for (let elem of member_card) {
                add_member_button.before(elem);
            }
        } else {
            add_member_button.before(member_card);
        }
    }

    _resetInstanceVariables() {

    }
}