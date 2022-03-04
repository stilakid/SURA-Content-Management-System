let succeeding_article;

// Disables every button in the from from submitting the form.
const disableSubmit = (event) => {
    event.preventDefault();
}

// Hides the popup menu after choosing a template.
const hidePopupMenu = (event) => {
    let popup_menu = document.querySelector("#popup-menu-container");
    popup_menu.style.visibility = "hidden";

    // Scrolls the popup menu back to the top.
    let templates = document.querySelector("#templates");
    templates.scrollTop = 0;
}

// Adds a template article/section above the 'New Section' button that triggered it.
const addTemplate = (event) => {
    template_id = event.currentTarget.id;
    query = "#hidden ." + template_id
    let selected_template = document.querySelector(query);

    let article = selected_template.cloneNode(true);
    article.classList.add(".article");

    // Takes care of the edge case of footer since footer is outside main and articles should be inside main.
    // Hence, we cannot just append the new article/section directly above the footer.
    if (succeeding_article == document.querySelector("footer")) {
        let main = document.querySelector("main");
        main.append(article);
    } else {
        succeeding_article.before(article);
    }

    // Add 'New Section' button
    let new_section_button = document.querySelector("#hidden .new-section").cloneNode(true);
    new_section_button.addEventListener("click", addNewSection);
    article.before(new_section_button);

    // Add 'Delete Section' button
    let delete_section_button = document.querySelector("#hidden .delete-section").cloneNode(true);
    article.prepend(delete_section_button);
    delete_section_button.addEventListener("click", deleteSection);
}

// Wrapper function so that multiple callback functions get triggered by a single event.
const initializeTemplates = (event) => {
    hidePopupMenu();
    addTemplate(event);
}

// Adds a new section above the 'New Section' button.
const addNewSection = (event) => {
    let popup_menu = document.querySelector("#popup-menu-container");
    popup_menu.style.visibility = "visible";
    succeeding_article = event.currentTarget;
}

const deleteSection = (event) => {
    event.currentTarget.parentElement.remove();
}


const main = () => {
    let buttons = document.querySelectorAll("button");

    // NEED TO OMIT THE SAVE BUTTON!!!!!!!
    // HAVENT WRITTEN CODE FOR IT YET!!!
    for (let button of buttons) {
        button.addEventListener("click", disableSubmit);
    }


    //  Make Popup Menu Ready
    let templates = document.querySelectorAll(".template");
    for (let template of templates) {
        template.addEventListener("click", initializeTemplates);
    }

    //  To footer:
    //      Add 'New Section' Buttons
    let new_section_button = document.querySelector("#hidden .new-section").cloneNode(true);
    let footer = document.querySelector("footer");
    footer.before(new_section_button);
    new_section_button.addEventListener("click", addNewSection);

    //      Add 'Delete Section' Buttons
    let delete_section_button = document.querySelector("#hidden .delete-section").cloneNode(true);
    footer.prepend(delete_section_button);
    delete_section_button.addEventListener("click", deleteSection);

    //  To articles:
    let articles = document.querySelectorAll(".article");
    for (let article of articles) {
        //  Add 'New Section' Buttons
        let new_section_button = document.querySelector("#hidden .new-section").cloneNode(true);
        article.before(new_section_button);
        new_section_button.addEventListener("click", addNewSection);

        //  Add 'Delete Section' Buttons
        let delete_section_button = document.querySelector("#hidden .delete-section").cloneNode(true);
        article.prepend(delete_section_button);
        delete_section_button.addEventListener("click", deleteSection);
    }




}



main();

// When you submit the webpage, delete all the buttons and stuff. These have the class 'admin'.