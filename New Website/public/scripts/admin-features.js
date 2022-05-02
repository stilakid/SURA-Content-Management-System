// For creating new page mechanism.

import apiRequest from "./api.js";


// ######################################## Global Variables #########################################

let succeeding_article;
let link_button;

// ##################################### Global Helper Functions #####################################


// Hides "Add Link" Dialog box and deletes inputs entered.
const hideAddLinkDialog = () => {
    let dialog = document.querySelector("#add-link-dialog");
    dialog.style.visibility = "hidden";
    let inputs = dialog.querySelectorAll("input");
    for (let input of inputs) {
        input.value = "";
    }
}


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


const update_admin_buttons = (old_id, new_id) => {
    let old_admin_controls = document.querySelector(old_id);
    old_admin_controls.style.display = "none";

    let new_admin_controls = document.querySelector(new_id);
    new_admin_controls.style.display = "flex";
}



// ###################################################################################################
// Helper Function: Log Out Button
// ###################################################################################################


const onLogOut = () => {
    sessionStorage.removeItem("API_KEY");
    // Redirects the user to the homepage after successfully logging out.
    window.location.href="/";
}


// Replaces the login button with the logout button
const make_logout_button = () => {
    let logout_button = document.querySelector("#login-leaf a");
    logout_button.textContent = "Logout";
    logout_button.removeAttribute("href");
    logout_button.style.cursor = "pointer";
    logout_button.addEventListener("click", onLogOut);
}


// ###################################################################################################
// Helper Function: Show Admin Controls Functionality
// ###################################################################################################

const show_admin_controls = () => {
    let admin_controls = document.querySelector("#admin-controls");
    admin_controls.style.display = "flex";
}


// ###################################################################################################
// Helper Function: Make New Page Functionality
// ###################################################################################################


// When creating a new page, the file system changes. So, the page reloads automatically.
// However, we want to load the new page instead.
const redirect_if_page_reloaded_while_creating_newpage = async () => {
    let page_name = sessionStorage.getItem("newpage");
    if (page_name !== null) {
        let res = await apiRequest("GET", "/protected/webpages/" + page_name);
        sessionStorage.removeItem("newpage");

        if (res["Page Exists"] === true) {
            let url = "/html_not_core/" + page_name;
            window.location.href = url;
        }
    }
}


const makeNewPage = async (e) => {
    // Makes a copy of the default page.
    // Registers this new webpage in MongoDB webpages collection.
    let file_name = document.querySelector("#make-new-page-dialog input").value + ".html";
    // We store info in session storage because the post method below may create a new file in the same
    // directory as the one this file is in.
    // This forces the webpage to reload.
    // So, we cannot directly redirect our webpage to the new webpage.
    sessionStorage.setItem("newpage", file_name);
    await apiRequest("POST", "/protected/webpages", {"id": file_name});
}


const hideMakeNewPageDialog = () => {
    let dialog = document.querySelector("#make-new-page-dialog");
    dialog.style.visibility = "hidden";
    let input = dialog.querySelector("input");
    input.value = "";
}


const showMakeNewPageDialog = () => {
    let dialog = document.querySelector("#make-new-page-dialog");
    dialog.style.visibility = "visible";
}


const enable_make_new_page = () => {
    redirect_if_page_reloaded_while_creating_newpage();

    // Make "Make New Page" dialog box work
    let make_new_page = document.querySelector("#make-new-page-dialog .create-new-page");
    let do_not_make_new_page = document.querySelector("#make-new-page-dialog .cancel");
    
    make_new_page.addEventListener("click", makeNewPage);
    do_not_make_new_page.addEventListener("click", hideMakeNewPageDialog);

    // Make "Make New page" dialog box accessible
    let button = document.querySelector("#make-new-page");
    button.addEventListener("click", showMakeNewPageDialog);
}



// ###################################################################################################
// Helper Function: Edit Page Functionality
// ###################################################################################################


// Hides the popup menu after choosing a template.
const hidePopupMenu = (event) => {
    let popup_menu = document.querySelector("#popup-menu-container");
    popup_menu.style.visibility = "hidden";

    // Scrolls the popup menu back to the top.
    let templates = document.querySelector("#templates");
    templates.scrollTop = 0;
}


// Adds a template article/section above the 'New Section' button that triggered it.
const clone_template = (event) => {
    let template_id = event.currentTarget.id;
    let query = "#hidden ." + template_id
    let selected_template = document.querySelector(query);

    let article = selected_template.cloneNode(true);
    article.classList.add("article");

    return article;
}


// Invokes the dialog box that allows you to add a link to the button.
const invokeAddLink = (event) => {
    let add_link_dialog = document.querySelector("#add-link-dialog");
    add_link_dialog.style.visibility = "visible";
    link_button = event.currentTarget;
}


// Make add-link button work
const prepare_add_link_button = (article) => {
    let add_link_buttons = article.querySelectorAll(".add-link");
    for (let add_link_button of add_link_buttons) {
        add_link_button.addEventListener("click", invokeAddLink);
    }
}


// Adds an image when the "add image" button is clicked.
const addImage = () => {

}


// Make add-image button work
const prepare_add_image_button = (article) => {

}


const add_template = (article) => {
    // Takes care of the edge case of footer since footer is outside main and articles are inside main.
    // Hence, we cannot just append the new article/section directly above the footer.
    if (succeeding_article == document.querySelector("footer")) {
        let main = document.querySelector("main");
        main.append(article);
    } else {
        succeeding_article.before(article);
    }
}


const add_new_section_button = (article) => {
    // Add 'New Section' button
    let new_section_button = document.querySelector("#hidden .new-section").cloneNode(true);
    new_section_button.addEventListener("click", addNewSection);
    article.before(new_section_button);
}


const add_delete_section_button = (article) => {
    // Add 'Delete Section' button
    let delete_section_button = document.querySelector("#hidden .delete-section").cloneNode(true);
    article.prepend(delete_section_button);
    delete_section_button.addEventListener("click", deleteSection);
}


const prepare_templates_menu = () => {
    //  Make Templates Menu Ready
    let templates = document.querySelectorAll(".template");
    for (let template of templates) {
        template.addEventListener("click", (event) => {
            hidePopupMenu();
            let article = clone_template(event);
            prepare_add_image_button(article);
            prepare_add_link_button(article);
            add_template(article);
            add_new_section_button(article);
            add_delete_section_button(article);
        });
    }
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


const prepare_add_link_dialog = () => {
    // Make "Add Link" dialog box work
    let save_link = document.querySelector("#add-link-dialog .save");
    let do_not_save_link = document.querySelector("#add-link-dialog .cancel");
    save_link.addEventListener("click", addLink);
    do_not_save_link.addEventListener("click", hideAddLinkDialog);
}


const prepare_add_image_dialog =() => {
    // Make Add Image Button Work
    // let add_image_buttons = document.querySelectorAll(".article .add-image");
    // for (let add_image_button of add_image_buttons) {
    //     add_image_button.addEventListener("click", addImage)
    // }
}


const initialize_dialog_boxes = () => {
    prepare_templates_menu();
    prepare_add_link_dialog();
    prepare_add_image_dialog();
}


const add_buttons_to_footer = () => {
    //      Add 'New Section' Buttons
    let new_section_button = document.querySelector("#hidden .new-section").cloneNode(true);
    let footer = document.querySelector("footer");
    footer.before(new_section_button);
    new_section_button.addEventListener("click", addNewSection);

    //      Add 'Delete Section' Buttons
    let delete_section_button = document.querySelector("#hidden .delete-section").cloneNode(true);
    footer.prepend(delete_section_button);
    delete_section_button.addEventListener("click", deleteSection);
}


const add_buttons_to_articles = () => {
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



const enable_edit_page = () => {
    let edit_page_button = document.querySelector("#edit-page");
    edit_page_button.addEventListener("click", () => {
        initialize_dialog_boxes();
        add_buttons_to_footer();
        add_buttons_to_articles();
        update_admin_buttons("#admin-controls", "#save-cancel");
    });

    // Make Add Image Button Work
    // let add_image_buttons = document.querySelectorAll(".article .add-image");
    // for (let add_image_button of add_image_buttons) {
    //     add_image_button.addEventListener("click", addImage)
    // }
}


// ###################################################################################################
// Helper Function: Save Page Functionality
// ###################################################################################################

// Saves webpage info as JSON in MondoDB
async function saveWebpage () {
    // Collect webpage data in an object/dict/map
    let webpage = {}
    // webpage id is the file name for the current html.
    webpage["id"] = location.href.split("/").slice(-1)[0];
    webpage["articles"] = [];
    let articles = document.querySelectorAll(".article");
    for (let article of articles) {
        let article_obj = {};
        article_obj["template"] = article.classList[0];
        article_obj["heading"] = article.querySelector(".article-title").textContent;
        
        let subheadings = article.querySelectorAll(".article-subheading");
        article_obj["subheadings"] = [];
        for (let i = 0; i < subheadings.length; i++) {
            article_obj["subheadings"][i] = subheadings[i].textContent;
        }
        
        let texts = article.querySelectorAll(".article-text");
        article_obj["texts"] = [];
        for (let i = 0; i < texts.length; i++) {
            article_obj["texts"][i] = texts[i].textContent;
        }

        let images = article.querySelectorAll(".article-image");
        article_obj["images"] = [];
        for (let i = 0; i < images.length; i++) {
            article_obj["images"][i] = images[i];
        }

        let links = article.querySelectorAll(".button-link a");
        article_obj["links"] = []
        for (let i = 0; i < links.length; i++) {
            let link = {}
            link["text"] = links[i].textContent;
            link["url"] = links[i].href;
            article_obj["links"][i] = link;
        }
        webpage["articles"].push(article_obj);
    }

    let id = location.href.split("/").slice(-1)[0];
    let url = "/protected/webpages/" + id;
    let res = await apiRequest("PATCH", url, webpage);
    console.log(res);
}


const delete_edit_buttons = () => {
    let new_section_buttons = document.querySelectorAll("#preview-area .new-section");
    let delete_section_buttons = document.querySelectorAll("#preview-area .delete-section");

    for (let new_sec_button of new_section_buttons) {
        new_sec_button.remove();
    }
    for (let del_sec_but of delete_section_buttons) {
        del_sec_but.remove();
    }
}

// Patch data
const enable_save_page = () => {
    // Save Edits
    let save = document.querySelector("#save-webpage");
    save.addEventListener("click", saveWebpage);

    // Cancel Edits
    let cancel = document.querySelector("#cancel_changes");
    cancel.addEventListener("click", () => {
        update_admin_buttons("#save-cancel", "#admin-controls");
        delete_edit_buttons();
        location.reload();
    });
}


// ###################################################################################################
// Helper Function: Delete Page Functionality
// ###################################################################################################


const finishDeletePage = async () => {
    let page_name = sessionStorage.getItem("Delete Page");
    if (page_name !== null) {
        let res = await apiRequest("GET", "/protected/webpages/" + page_name);
        sessionStorage.removeItem("Delete Page");

        if (res["Page Exists"] === true) {
            let url = "/protected/webpages/" + page_name;
            await apiRequest("DELETE", url, {});
        }
    }
}


const startDeletePage = async () => {
    let file_name = location.href.split("/").slice(-1)[0];
    sessionStorage.setItem("Delete Page", file_name);
    window.location.href = "/default-page.html";
}


const enable_delete_page = () => {
    finishDeletePage();
    let delete_button = document.querySelector("#delete-page");
    delete_button.addEventListener("click", startDeletePage);
}


// ###################################################################################################
// Helper Function: Editing Navigation Bar Functionality
// ###################################################################################################


const initialize_edit_nav_bar_button = () => {
    let button = document.querySelector("#edit-nav-bar");
    button.addEventListener("click", () => {
        let edit_nav_dialog = document.querySelector("#edit-nav-dialog");
        edit_nav_dialog.style.visibility = "visible";
    });
}


const move_item_between_lists = (list1, list2) => {
    let items = [];
    for (let option of list1.options) {
        if (option.selected) {
            items.push(option);
        }
    }
    for (let option of items) {
        option.remove();
        list2.append(option);
    }
}


const prepare_nav_controls = (navbar, list1_id, list2_id) => {
    let list1 = document.querySelector(list1_id);
    let list2 = document.querySelector(list2_id);
    let button = document.querySelector(`${navbar} .include`);
    button.addEventListener("click", () => {
        move_item_between_lists(list1, list2);
    });

    button = document.querySelector(`${navbar} .exclude`);
    button.addEventListener("click", () => {
        move_item_between_lists(list2, list1);
    });
}


const prepare_nav_lists = async (path, list1_id, list2_id) => {
    let nav_bar_data = await apiRequest("GET", path);
    let webpages = await apiRequest("GET", "/protected/webpages");
    let included_webpages = [];
    for (let link of nav_bar_data) {
        let webpage = link[1].split("/").slice(-1)[0];
        included_webpages.push(webpage);
    }

    let list1 = document.querySelector(list1_id);
    let list2 = document.querySelector(list2_id);

    for (let webpage of webpages) {
        let option = document.createElement("option");
        option.textContent = webpage;
        if (included_webpages.includes(webpage)) {
            list1.append(option);
        }
        else {
            list2.append(option);
        }
    }
}


const apply_changes_to_nav = () => {
    let list = document.querySelector(list_id);
    // Get display names and send it to server along with their filenames.
    // Keep a list of core html files in the database.
    // If the filename is not included in the list of core files, then it is in 'html-not-core' directory.
}


const prepare_apply_button = () => {
    let apply_button = document.querySelector("#handle-navbar-changes .save");
    apply_button.addEventListener("click", () => {
        apply_changes_to_nav("#select2");
        apply_changes_to_nav("#select4");
        location.reload();
    });
}


const prepare_cancel_button = () => {
    let cancel_button = document.querySelector("#handle-navbar-changes .cancel");
    cancel_button.addEventListener("click", () => {
        let edit_nav_dialog = document.querySelector("#edit-nav-dialog");
        edit_nav_dialog.style.visibility = "hidden";
    });
}


const enable_edit_nav_bar = () => {
    initialize_edit_nav_bar_button();
    prepare_nav_controls("#primary-nav-control", "#select1", "#select2");
    prepare_nav_controls("#secondary-nav-control", "#select3", "#select4");
    prepare_nav_lists("/navbars", "#select1", "#select2");
    let page_name = location.href.split("/").slice(-1)[0];
    // prepare_nav_lists(`/navbars/${page_name}`, "#select3", "#select4");
    prepare_apply_button();
    prepare_cancel_button();
}


// ###################################################################################################
// ########################################## Main Function ##########################################
// ###################################################################################################

const add_admin_features = () => {
    // Checks if user is admin
    let API_KEY = sessionStorage.getItem('API_KEY');
    const isAdmin = (API_KEY !== null);
    if (isAdmin) {
        make_logout_button();
        show_admin_controls();
        enable_make_new_page();
        enable_edit_page();
        enable_save_page();
        enable_delete_page();
        enable_edit_nav_bar();
    }
}



export default add_admin_features;