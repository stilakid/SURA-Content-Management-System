let succeeding_article;
let link_button;

// Disables every button in the form from submitting the form.
const disableSubmit = (event) => {
    event.preventDefault();
}


// ###################################################################################################
// Add and Delete Section
// ###################################################################################################


// Adds a new section above the 'New Section' button.
const addNewSection = (event) => {
    let popup_menu = document.querySelector("#popup-menu-container");
    popup_menu.style.visibility = "visible";
    succeeding_article = event.currentTarget;
}


// Deletes an existing section.
const deleteSection = (event) => {
    event.currentTarget.parentElement.previousElementSibling.remove();
    event.currentTarget.parentElement.remove();
}


// Wrapper function so that multiple callback functions get triggered by a single event.
const initializeTemplates = (event) => {
    hidePopupMenu();
    addTemplate(event);
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
    article.classList.add("article");

    // Make add-image button work

    // Make add-link button work
    let add_link_buttons = article.querySelectorAll(".add-link");
    for (let add_link_button of add_link_buttons) {
        add_link_button.addEventListener("click", invokeAddLink);
    }

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


// ###################################################################################################
// Add image button
// ###################################################################################################


// Adds an image when the "add image" button is clicked.
const addImage = () => {

}


// ###################################################################################################
// Add link button
// ###################################################################################################


// Invokes the dialog box that allows you to add a link to the button.
const invokeAddLink = (event) => {
    let add_link_dialog = document.querySelector("#add-link-dialog");
    add_link_dialog.style.visibility = "visible";
    link_button = event.currentTarget;
}


// Adds a link to the button.
const addLink= () => {
    let a = document.createElement("a");

    let button_label = document.querySelector("#link-name");
    let button_link = document.querySelector("#URL");

    let div = document.createElement("div");
    a.textContent = button_label.value;
    a.href = button_link.value;
    div.append(a);
    div.classList.add("button-link");



    link_button.replaceWith(div);
    hideAddLinkDialog();
}


// Hides "Add Link" Dialog box and deletes inputs entered.
const hideAddLinkDialog = () => {
    let dialog = document.querySelector("#add-link-dialog");
    dialog.style.visibility = "hidden";
    let inputs = dialog.querySelectorAll("input");
    for (let input of inputs) {
        input.value = "";
    }
}


// ###################################################################################################
// Main Initialization
// ###################################################################################################

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

    // Make Add Image Button Work
    // let add_image_buttons = document.querySelectorAll(".article .add-image");
    // for (let add_image_button of add_image_buttons) {
    //     add_image_button.addEventListener("click", addImage)
    // }

    // Make "Add Link" dialog box work
    let save_link = document.querySelector("#add-link-dialog .save");
    let do_not_save_link = document.querySelector("#add-link-dialog .cancel");
    save_link.addEventListener("click", addLink);
    do_not_save_link.addEventListener("click", hideAddLinkDialog);


}



main();

// When you submit the webpage, delete all the buttons and stuff. These have the class 'admin'.