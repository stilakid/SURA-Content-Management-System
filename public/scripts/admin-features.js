// Table of Content

// Global Variables
// Global Helper Functions
// Helper Function: Logout Button
// Helper Function: Show Admin Controls Functionality
// Helper Function: Make New Page Functionality
// Helper Function: Edit Page Functionality
// Helper Function: Save Page Functionality
// Helper Function: Delete Page Functionality
// Helper Function: Editing Navigation Bar Functionality
// Main Function


// ######################################## Global Variables #########################################


let succeeding_article;
let link_button;
let active_admin_buttons = "#admin-controls";

// ##################################### Global Helper Functions #####################################


// Adds a new section above the 'New Section' button.
const addNewSection = (event) => {
    let popup_menu = document.querySelector("#popup-menu-container");
    popup_menu.style.visibility = "visible";
    succeeding_article = event.currentTarget;
}


// Deletes an existing section.
const deleteSection = (event) => {
    event.currentTarget.closest(".article").previousElementSibling.remove();
    event.currentTarget.closest(".article").remove();
}

const makeEditSectionMenu = () => {
    let container = document.createElement('div');
    container.classList.add("section-menu");
    let content = document.createElement('div');
    container.append(content);

    let button_container = document.createElement('div');

    return container;
}

// Shows the edit section menu for the particular section.
const showEditSectionMenu = () => {
    let menu = makeEditSectionMenu();
    document.body.append(menu);
}


const update_admin_buttons = (old_id, new_id) => {
    let old_admin_controls = document.querySelector(old_id);
    old_admin_controls.style.display = "none";

    let new_admin_controls = document.querySelector(new_id);
    new_admin_controls.style.display = "flex";

    active_admin_buttons = new_id;
}


const set_up_color_picker = (color, button, theme) => {
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



// ###################################################################################################
// Helper Function: Logout Button
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

const expand_admin_controls = () => {
    $(active_admin_buttons).show("slide", { direction: "down" }, 500);
    // let admin_controls = document.querySelector(active_admin_buttons);
    // admin_controls.style.display = "flex";

    let circle = document.querySelector("#expand");
    circle.style.visibility = "hidden";

    circle = document.querySelector("#collapse");
    circle.style.visibility = "visible";
}

const collapse_admin_controls = () => {
    $(active_admin_buttons).hide("slide", { direction: "down" }, 500);
    // let admin_controls = document.querySelector(active_admin_buttons);
    // admin_controls.style.display = "none";

    let circle = document.querySelector("#collapse");
    circle.style.visibility = "hidden";

    circle = document.querySelector("#expand");
    circle.style.visibility = "visible";
}

const show_admin_controls = () => {

    let circle = document.querySelector("#expand");
    circle.addEventListener("click", expand_admin_controls);
    circle.style.visibility = "visible";

    circle = document.querySelector("#collapse");
    circle.addEventListener("click", collapse_admin_controls);
}


// ###################################################################################################
// Helper Function: Make New Page Functionality
// ###################################################################################################


// const makeNewPage = async (e) => {
//     // Makes a copy of the default page.
//     // Registers this new webpage in MongoDB webpages collection.
//     let input = document.querySelector("#make-new-page-dialog input").value;
//     if (!input.match(/^[0-9A-Za-z]+$/)) {
//         alert("Input is not alphanumeric");
//         return;
//     }

//     let file_name = document.querySelector("#make-new-page-dialog input").value + ".html";
//     await apiRequest("POST", "/protected/webpages", {"id": file_name});

//     // Checks if the new webpage has been added to the mondoDB database.
//     let res = await apiRequest("GET", "/protected/webpages/" + file_name);
//     if (res["Page Exists"] === true) {
//         let url = "/html_not_core/" + file_name;
//         window.location.href = url;
//     }
// }


// const hideMakeNewPageDialog = () => {
//     let dialog = document.querySelector("#make-new-page-dialog");
//     let dialog_container = dialog.closest(".dialog-box-container");
//     dialog_container.style.visibility = "hidden";
//     let input = dialog.querySelector("input");
//     input.value = "";
// }


// const showMakeNewPageDialog = () => {
//     let dialog = document.querySelector("#make-new-page-dialog");
//     let dialog_container = dialog.closest(".dialog-box-container");
//     dialog_container.style.visibility = "visible";
// }


// const enable_make_new_page = () => {
//     // Make "Make New Page" dialog box work
//     let make_new_page = document.querySelector("#make-new-page-dialog .create-new-page");
//     let do_not_make_new_page = document.querySelector("#make-new-page-dialog .cancel");
    
//     make_new_page.addEventListener("click", makeNewPage);
//     do_not_make_new_page.addEventListener("click", hideMakeNewPageDialog);

//     // Make "Make New page" dialog box accessible
//     let button = document.querySelector("#make-new-page");
//     button.addEventListener("click", showMakeNewPageDialog);
// }



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


// Hides "Add Link" Dialog box and deletes inputs entered.
const hideAddLinkDialog = () => {
    let dialog = document.querySelector("#add-link-dialog");
    let dialog_box_container = dialog.closest(".dialog-box-container");
    dialog_box_container.style.visibility = "hidden";
    let inputs = dialog.querySelectorAll("input");
    for (let input of inputs) {
        input.value = "";
    }
}


// Invokes the dialog box that allows you to add a link to the button.
const invokeAddLink = (event) => {
    let dialog = document.querySelector("#add-link-dialog");
    let dialog_box_container = dialog.closest(".dialog-box-container");
    dialog_box_container.style.visibility = "visible";
    link_button = event.currentTarget;
}


// Make add-link button work
const prepare_add_link_buttons = (article) => {
    let add_link_buttons = article.querySelectorAll(".add-link");
    for (let add_link_button of add_link_buttons) {
        add_link_button.style.display = "flex";
        add_link_button.addEventListener("click", invokeAddLink);
    }
}


const prepare_delete_link_buttons = (article) => {
    let links = article.querySelectorAll(".button-link");
    for (let div of links) {
        add_delete_link_button(div);
    }
}

// Deletes an image.
const deleteImage = (event) => {
    let del_button = event.currentTarget;
    let img_container = del_button.parentElement;
    let input = img_container.querySelector("input");

    // Create and add default buttons
    let add_img_button = document.createElement("button");
    add_img_button.classList.add("add-image");
    let add_img = document.createElement("img");
    add_img.setAttribute("src", Util.addImgPic);
    add_img_button.append(add_img);
    input.after(add_img_button);

    // Remove previous img and the delete button.
    let img = img_container.querySelector(".image");
    img.remove();
    del_button.remove();

    // Set input value and url holder textContent to empty string.
    input.value = "";
    let url_holder = img_container.querySelector(".img-url");
    url_holder.textContent = "";

    // Pair input with add_img_button
    add_img_button.addEventListener("click", () => {
        input.click();
    });
    input.addEventListener("change", addImage);
}


const deleteMember = (event) => {
    let del_button = event.currentTarget;
    let team_member = del_button.closest(".team-member");
    team_member.remove();
}


const add_delete_image_button = (url_holder) => {
    let delete_img = document.createElement("button");
    delete_img.textContent = "Delete Image";
    delete_img.classList.add("delete-img-button");
    delete_img.addEventListener("click", (event) => {
        // for template 11.
        let many_images = url_holder.closest(".many-images.team-members");
        if (many_images !== null) {
            deleteMember(event);
        }
        else {
            deleteImage(event);
        }
    });
    url_holder.after(delete_img);
}


const makeAddMemberButton = (parent_element) => {
    let new_team_member = document.createElement("div");
    let new_image_container = document.createElement("div");
    let new_input = document.createElement("input");
    let new_button = document.createElement("button");
    let new_url_holder = document.createElement("p");
    let new_img = document.createElement("img");

    new_button.append(new_img);
    new_image_container.append(new_input);
    new_image_container.append(new_button);
    new_image_container.append(new_url_holder);
    new_team_member.append(new_image_container);
    parent_element.append(new_team_member);

    new_team_member.classList.add("team-member");
    new_image_container.classList.add("image-container");
    new_input.setAttribute("type", "file");
    new_input.setAttribute("accept", "image/*");
    new_button.classList.add("add-image");
    new_img.setAttribute("src", Util.addImgPic);
    new_url_holder.classList.add("img-url");

    // This will activate the else statement in the function being called since the argument
    // being passed is not an article. That is how this is supposed to work.
    // This will not create an infinite loop even when the callee function can call the caller
    // in a particular if statement.
    prepare_add_image_buttons(new_team_member);
}


// Adds an image when the "add image" button is clicked.
const addImage = (event) => {
    let input = event.currentTarget;
    let file = input.files[0];
    if (!file) return;

    // Because of fakepath, we can upload the file but cannot display it before uploading.
    // So, we will use data url until we save the page.
    let img_container = input.parentElement;
    let add_img_button = img_container.querySelector(".add-image");
    let url_holder = img_container.querySelector(".img-url");

    let reader = new FileReader();
    reader.addEventListener("error", (event) => {
      throw new Error("Error reading image file");
    });
    reader.addEventListener("load", (event) => {
        let img = document.createElement("img");
        img.setAttribute("src", reader.result);
        img.classList.add("image");
        add_img_button.replaceWith(img);

        // Add delete image button
        add_delete_image_button(url_holder);

        // Adds a class to img for a specific template.
        let template = input.closest(".template-11");
        if (template !== null) {
            img.classList.add("member-photo");
        }
    });
    reader.readAsDataURL(file);


    // Extra bit for templates that accept infinite images.
    // Adds back the add image button
    let query = input.closest(".many-images");
    if (query !== null) {
        let team_members = input.closest(".team-members");
        makeAddMemberButton(team_members);
    }

    // Specifically for template-11 (team members template)
    // Adds fields for name and designation.
    let template = input.closest(".template-11");
    if (template !== null) {
        let member_info = document.createElement("div");
        let name = document.createElement("h3");
        let designation = document.createElement("textarea");
        let team_member = input.closest(".team-member");
        
        member_info.append(name);
        member_info.append(designation);
        team_member.append(member_info);

        member_info.classList.add("text-container", "member-info");
        name.classList.add("article-subheading");
        designation.classList.add("article-text");

        name.setAttribute("contenteditable", "true");
        designation.setAttribute("contenteditable", "true");

        name.textContent = "Name";
        designation.textContent = "Designation";
    }
}


// Make add-image button work
const prepare_add_image_buttons = (article) => {
    // If template 11, button does not exist. Make it first.
    if (article.classList.contains("template-11")) {
        let parent_element = article.querySelector(".team-members");
        makeAddMemberButton(parent_element);
    }
    // Button exists. Make it dynamic.
    else {
        let add_img_buttons = article.querySelectorAll(".add-image");

        for (let add_img_button of add_img_buttons) {
            let image_container = add_img_button.closest(".image-container");
            let input = image_container.querySelector("input");
            
            add_img_button.addEventListener("click", () => {
                input.click();
            });
            input.addEventListener("change", addImage);
        }
    }
}


const prepare_delete_image_buttons = (main) => {
    let img_url_holders = main.querySelectorAll(".img-url");
    for (let url_holder of img_url_holders) {
        if (url_holder.textContent !== "") {
            add_delete_image_button(url_holder);
        }
    }
}


const add_template = (article) => {
    // Takes care of the edge case of footer since footer is outside main and articles are inside main.
    // Hence, we cannot just append the new article/section directly above the footer.
    if (succeeding_article == document.querySelector("footer").previousElementSibling) {
        console.log("hey there");
        let main = document.querySelector("main");
        let main_content_area = main.querySelector(".main-content");

        if (main_content_area === null) {
            main.append(article);
        }
        else {
            main_content_area.append(article);
        }
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


const add_modify_section_buttons = (article) => {
    // Add 'Delete Section' button
    let modify_section_buttons = document.querySelector("#hidden .modify-section").cloneNode(true);
    article.prepend(modify_section_buttons);

    let delete_section_button = modify_section_buttons.querySelector(".delete-section");
    delete_section_button.addEventListener("click", deleteSection);

    let edit_section_button = modify_section_buttons.querySelector(".edit-section");
    edit_section_button.addEventListener("click", showEditSectionMenu);
}


const prepare_templates_menu = () => {
    //  Make Templates Menu Ready
    let templates = document.querySelectorAll(".template");
    for (let template of templates) {
        template.addEventListener("click", (event) => {
            hidePopupMenu();
            let article = clone_template(event);
            Util.generateID(article);
            prepare_add_image_buttons(article);
            prepare_add_link_buttons(article);
            prepare_delete_link_buttons(article);
            add_template(article);
            add_new_section_button(article);
            add_modify_section_buttons(article);
        });
    }
}


const deleteLink = (event) => {
    let del_button = event.currentTarget;
    let link = del_button.parentElement;
    link.remove();
}


const add_delete_link_button = (div) => {
    // Add delete link button
    let delete_link = document.createElement("button");
    delete_link.classList.add("delete-link-button");
    delete_link.textContent = "Delete Link";
    delete_link.addEventListener("click", deleteLink);
    div.append(delete_link);
}


// Adds a link to the button.
const addLink= () => {
    let a = document.createElement("a");

    let button_label = document.querySelector("#link-name");
    let button_link = document.querySelector("#URL");

    let div = document.createElement("div");
    let button = document.createElement("button");
    a.textContent = button_label.value;
    a.href = button_link.value;
    button.append(a);
    div.append(button);
    div.classList.add("button-link");
    button.classList.add("link-button");

    link_button.before(div);
    hideAddLinkDialog();

    add_delete_link_button(div);
}


const prepare_add_link_dialog = () => {
    // Make "Add Link" dialog box work
    let save_link = document.querySelector("#add-link-dialog .save");
    let do_not_save_link = document.querySelector("#add-link-dialog .cancel");
    save_link.addEventListener("click", addLink);
    do_not_save_link.addEventListener("click", hideAddLinkDialog);
}


const initialize_dialog_boxes = () => {
    prepare_templates_menu();
    prepare_add_link_dialog();
}


const add_buttons_to_footer = () => {
    //      Add 'New Section' Buttons
    let new_section_button = document.querySelector("#hidden .new-section").cloneNode(true);
    let footer = document.querySelector("footer");
    footer.before(new_section_button);
    new_section_button.addEventListener("click", addNewSection);

    //      Add 'Edit Section' and 'Delete Section' Buttons
    let modify_section_buttons = document.querySelector("#hidden .modify-section").cloneNode(true);
    footer.prepend(modify_section_buttons);
    let delete_section_button = modify_section_buttons.querySelector(".delete-section");
    delete_section_button.addEventListener("click", deleteSection);
    let edit_section_button = modify_section_buttons.querySelector(".edit-section");
    edit_section_button.addEventListener("click", showEditSectionMenu);
}


const add_buttons_to_articles = () => {
    let articles = document.querySelectorAll(".article");
    for (let article of articles) {
        //  Add 'New Section' Buttons
        let new_section_button = document.querySelector("#hidden .new-section").cloneNode(true);
        article.before(new_section_button);
        new_section_button.addEventListener("click", addNewSection);

        //  Add 'Edit Section' and 'Delete Section' Buttons
        // let modify_section_buttons = document.querySelector("#hidden .modify-section").cloneNode(true);
        // article.prepend(modify_section_buttons);
        // let delete_section_button = modify_section_buttons.querySelector(".delete-section");
        // delete_section_button.addEventListener("click", deleteSection);
        // let edit_section_button = modify_section_buttons.querySelector(".edit-section");
        // edit_section_button.addEventListener("click", showEditSectionMenu);
    }
}


// To preserve new line character
const convert_p_to_textarea = () => {
    let query = ".text-container p";

    let editable_texts = document.querySelectorAll(query);
    for (let tag of editable_texts) {
        let textarea = document.createElement("textarea");
        textarea.innerHTML = tag.innerText;
        textarea.setAttribute("contenteditable", "true");
        textarea.classList.add("article-text");

        tag.replaceWith(textarea);
    }
}


const make_text_editable = () => {
    let query = "#page-title, article h1, article h2, article h3, article h4, article h5, article h6";

    let editable_texts = document.querySelectorAll(query);
    for (let tag of editable_texts) {
        tag.setAttribute("contenteditable", "true");
    }

    convert_p_to_textarea();
}


const addBackgroundImage = (event) => {
    let input = event.currentTarget;
    let file = input.files[0];
    if (!file) return;

    // Because of fakepath, we can upload the file but cannot display it before uploading.
    // So, we will use data url until we save the page.
    let reader = new FileReader();
    reader.addEventListener("error", (event) => {
      throw new Error("Error reading image file");
    });
    reader.addEventListener("load", (event) => {
        background_image = reader.result;
        background_video = "";

        let body = document.querySelector("body");
        body.style.backgroundImage = `linear-gradient(${background_color[0]}, ${background_color[1]}), url(${encodeURI(background_image)})`;
        let page_background_video = document.querySelector("#page-background-video source");
        page_background_video.removeAttribute("src");
        let vid = document.querySelector("#page-background-video");
        vid.load();
    });
    reader.readAsDataURL(file);
}


const addBackgroundVideo = (event) => {
    let input = event.currentTarget;
    let file = input.files[0];
    if (!file) return;

    // Because of fakepath, we can upload the file but cannot display it before uploading.
    // So, we will use data url until we save the page.
    let reader = new FileReader();
    reader.addEventListener("error", (event) => {
      throw new Error("Error reading image file");
    });
    reader.addEventListener("load", (event) => {
        background_image = "";
        background_video = reader.result;

        let body = document.querySelector("body");
        body.style.backgroundImage = `linear-gradient(${background_color[0]}, ${background_color[1]})`;
        let page_background_video = document.querySelector("#page-background-video source");
        page_background_video.src = encodeURI(background_video);
        let vid = document.querySelector("#page-background-video");
        vid.load();
    });
    reader.readAsDataURL(file);
}

const addBackgroundColor = (event) => {
    let body = document.querySelector("body");
    if (background_image !== "") {
        body.style.backgroundImage = `linear-gradient(${background_color[0]}, ${background_color[1]}), url(${encodeURI(background_image)})`;
    }
    // if bg video is present, it is handled by video tag. So, the bg-image property is the same as the case with only colors.
    else {
        body.style.backgroundImage = `linear-gradient(${background_color[0]}, ${background_color[1]})`;
    }
}


function add_button_for_image(button_container) {
    let add_img_button = document.createElement("button");
    let input_img = document.createElement("input");
    add_img_button.classList.add("add-bg-img");

    let label = document.createElement("div");
    label.classList.add("bg-button-text");
    let icon = document.createElement("div");
    label.textContent = "Background Image";
    icon.innerHTML = "<span class='material-icons'>image</span>";
    add_img_button.append(label);
    add_img_button.append(icon);

    input_img.classList.add("bg-img-input");
    input_img.type = "file";
    input_img.accept = "image/*";

    add_img_button.addEventListener("click", () => {
        input_img.click();
    });
    input_img.addEventListener("change", addBackgroundImage);

    button_container.append(add_img_button);
    button_container.append(input_img);
}

function add_button_for_video(button_container) {
    let add_vid_button = document.createElement("button");
    let input_vid = document.createElement("input");
    add_vid_button.classList.add("add-bg-vid");

    let label = document.createElement("div");
    label.classList.add("bg-button-text");
    let icon = document.createElement("div");
    label.textContent = "Background Video";
    icon.innerHTML = "<span class='material-icons'>movie</span>";
    add_vid_button.append(label);
    add_vid_button.append(icon);

    input_vid.classList.add("bg-vid-input");
    input_vid.type = "file";
    input_vid.accept = "video/*";

    add_vid_button.addEventListener("click", () => {
        input_vid.click();
    });
    input_vid.addEventListener("change", addBackgroundVideo);

    button_container.append(add_vid_button);
    button_container.append(input_vid);
}

const add_button_for_color = (button_container) => {
    let add_color_button_top = document.createElement("button");
    let add_color_button_bot = document.createElement("button");

    let label_1 = document.createElement("div");
    label_1.classList.add("bg-color-label");
    let label_2 = document.createElement("div");
    label_2.classList.add("bg-color-label");
    label_1.textContent = "Color - Top:"
    label_2.textContent = "Color - Bottom:"

    let button_sub_container_1 = document.createElement("div");
    let button_sub_container_2 = document.createElement("div");
    button_sub_container_1.classList.add("bg-color-container");
    button_sub_container_2.classList.add("bg-color-container");

    button_sub_container_1.append(label_1);
    button_sub_container_1.append(add_color_button_top);
    button_sub_container_2.append(label_2);
    button_sub_container_2.append(add_color_button_bot);

    button_container.append(button_sub_container_1);
    button_container.append(button_sub_container_2);
    
    let pickr_top = set_up_color_picker(background_color[0], add_color_button_top, 'monolith');
    let pickr_bot = set_up_color_picker(background_color[1], add_color_button_bot, 'monolith');

    pickr_top.on('save', (color) => {
        if (color !== null) {
            background_color[0] = color.toHEXA().toString();
            console.log(color.toHEXA().toString());
            console.log(background_color[0]);
        }
        else {
            background_color[0] = "transparent";
            console.log(color);
            console.log(background_color[0]);
        }
        addBackgroundColor();
    });
    pickr_bot.on('save', (color) => {
        if (color !== null) {
            background_color[1] = color.toHEXA().toString();
            console.log(color.toHEXA().toString());
            console.log(background_color[0]);
        }
        else {
            background_color[1] = "transparent";
            console.log(color);
            console.log(background_color[0]);
        }
        addBackgroundColor();
    });

}

const add_button_to_background = () => {
    let button_container = document.createElement("div");
    let button_container_wrapper = document.createElement("div");
    button_container.classList.add("bg-button-container");
    button_container_wrapper.classList.add("bg-button-container-wrapper");
    add_button_for_image(button_container);
    add_button_for_video(button_container);
    add_button_for_color(button_container);

    let empty_space = document.querySelector("#empty-space");
    button_container_wrapper.append(button_container);
    empty_space.append(button_container_wrapper);

    // let bg_color_1 = document.createElement("button");
    // bg_color_1.classList.add("change-bg-color");
    // bg_color_1.textContent = "Change Background Color";

    // let bg_color_2 = document.createElement("button");
    // bg_color_2.classList.add("change-bg-color");
    // bg_color_2.textContent = "Change Background Color";
}


const enable_edit_page = (data_model) => {
    let edit_page_button = document.querySelector("#edit-page");
    edit_page_button.addEventListener("click", async () => {
        initialize_dialog_boxes();
        add_button_to_background();
        add_buttons_to_footer();
        add_buttons_to_articles();
        // make_text_editable();

        let main = document.querySelector("main");
        prepare_delete_image_buttons(main);

        console.log("dm3", data_model);
        await Article.enterArticlesEditMode(main, data_model);


        let articles = main.querySelectorAll(".article");
        for (let article of articles) {
            // prepare_add_link_buttons(article);
            // prepare_delete_link_buttons(article);
            // prepare_add_image_buttons(article);
        }

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



function handle_basic_webpage_info(webpage, id) {
    webpage["id"] = id;
    webpage["title"] = document.querySelector("#page-title").textContent;
    webpage["articles"] = [];

    // let old_webpage = await apiRequest("GET", "/webpages/" + id);
    // webpage["sidebar"] = old_webpage["sidebar"];
    webpage["sidebar_title"] = "Navigation Pane";
    webpage["sidebar"] = [];
    let tertiary_navbar = document.querySelector("main .tertiary-navbar");
    if (tertiary_navbar !== null) {
        webpage["sidebar_title"] = document.querySelector("main .sidebar-title").textContent;

        let navlinks = tertiary_navbar.querySelectorAll("li a");
        for (let navlink of navlinks) {
            webpage["sidebar"].push([navlink.textContent, navlink.href]);
        }
    }
}


function handle_article_info(webpage) {
    make_text_editable();
    let articles = document.querySelectorAll(".article");
    for (let article of articles) {
        let article_obj = {};
        article_obj["template"] = article.classList[0];
        article_obj["heading"] = article.querySelector(".article-title").textContent;
        article_obj["article_id"] = article.id;

        let subheadings = article.querySelectorAll(".article-subheading");
        article_obj["subheadings"] = [];
        for (let i = 0; i < subheadings.length; i++) {
            article_obj["subheadings"][i] = subheadings[i].textContent;
        }

        let texts = article.querySelectorAll(".article-text");
        article_obj["texts"] = [];
        for (let i = 0; i < texts.length; i++) {
            article_obj["texts"][i] = [];
            let text = texts[i].value.split(/\n/g);
            article_obj["texts"][i] = text;
        }

        let add_link_buttons = article.querySelectorAll(".add-link");
        article_obj["links"] = [];
        for (let i = 0; i < add_link_buttons.length; i++) {
            let link_nodes = add_link_buttons[i].parentElement.querySelectorAll(".button-link a");
            let links_arr = [];
            for (let link_node of link_nodes) {
                let link = {};
                link["text"] = link_node.textContent;
                link["url"] = link_node.href;
                links_arr.push(link);
            }
            article_obj["links"].push(links_arr);
        }
        webpage["articles"].push(article_obj);
    }
    return articles;
}


// async function handle_new_image(webpage_name, input, imageNames) {
//     let imageData = new FormData();
//     imageData.append("webpage", webpage_name);
//     imageData.append("media", "image");
//     let filename = input.files[0].name;

//     // If there is no conflict
//     if (!imageNames.includes(filename)) {
//         // Add file to image form
//         imageData.append("image", input.files[0]);
//     }
//     // If there is conflict
//     else {
//         // Generate new unique filename
//         let parts_of_filename = input.files[0].name.split(".");
//         let primary_filename = "";
//         for (let i = 0; i < parts_of_filename.length - 1; i++) {
//             primary_filename += parts_of_filename[i] + ".";
//         }
//         let file_extension = parts_of_filename.slice(-1)[0];
//         filename = primary_filename + file_extension;
//         let i = 1;
//         while (imageNames.includes(filename)) {
//             filename = `${primary_filename}${i}.${file_extension}`;
//             i++;
//         }

//         // Make new file with new filename
//         let file = new File([input.files[0]], filename, {
//             type: input.files[0].type,
//             lastModified: input.files[0].lastModified
//         });

//         // Add file to image form
//         imageData.append("image", file);
//     }

//     // Post new image to server and get filename
//     // The server checks if an old image that was deleted in this session and a new image added in this session has the same filename.
//     let url = "/protected/images";
//     let updated_filename = await apiRequest("POST", url, imageData, "formData");

//     // Adds updated filename to the array imageNames to keep track of new names.
//     imageNames.push(updated_filename);
//     return updated_filename;
// }


async function handle_images(webpage, articles) {
//     let webpage_name = webpage["id"].slice(0, -5);
//     // For resolving name conflicts, we store img names in the array below.
//     let imageNames = [];
//     // To resolve image file naming conflict on the client side, we want to get all image names first.
//     let image_containers = document.querySelectorAll("main .image-container");

//     // If input is empty, it could mean 2 things:
//     //      1) There is no image assigned.
//     //      2) There is an image but it was assigned before this session.
//     // If input is not empty, then the image was assigned in this session.
//     //
//     // To resolve naming conflicts, we need to know the old image names first before the new image names because
//     //  1) We can assume that old images names do not have naming conflicts amongst themselves.
//     //  2) We do not have access to old image files (server sends us data urls) so changing their name is only possible on the server side.
//     //
//     // So, we loop over all inputs to get old image names first
//     // We resolve image name conflicts for new images later as we are posting the images to the server.
//     // Loop one for gathering old image names exclusively
//     for (let image_container of image_containers) {
//         let input = image_container.querySelector("input");
//         if (input.value === "") {
//             let elem = image_container.querySelector(".image");
//             // If its an old image, it will be a node object.
//             // If it is empty, it will null.
//             if (elem !== null) {
//                 // Url stored in src attribute of img is a dataurl, so we get url from the tag after it,
//                 // which is where we saved it whien loading the page.
//                 let url = image_container.querySelector(".img-url").textContent;
//                 let filename = url.split("/").slice(-1)[0];
//                 imageNames.push(filename);
//             }
//         }
//     }
    // Add bg image name if it exists.
    let input = document.querySelector(".bg-img-input");
    if (input.value === "" && background_image !== "") {
        let filename = background_image.split("/").slice(-1)[0];
        imageNames.push(filename);
    }

//     // Loop 2 for:
//     //  1) Resolving name conflicts.
//     //  2) Saving images to server.
//     //  3) Adding image data to the data that will be sent to the server.
//     for (let i = 0; i < articles.length; i++) {
//         let article = articles[i];
//         webpage["articles"][i]["images"] = []; // This is the article_obj["images"]

//         let image_containers = article.querySelectorAll(".image-container");
//         for (let image_container of image_containers) {
//             let input = image_container.querySelector("input");
//             let elem = image_container.querySelector(".image");

//             // If it's an old image
//             if (input.value === "" && elem !== null) {
//                 // Add file url to webpage data
//                 let url_holder = image_container.querySelector(".img-url");
//                 let url = url_holder.textContent;
//                 webpage["articles"][i]["images"].push(url);
//             }

//             // If it's not assigned an image
//             else if (input.value === "" && elem === null) {
//                 // Add empty string in place of file url to webpage data
//                 webpage["articles"][i]["images"].push("");
//             }

//             // If it's a new image
//             else {
//                 // Create image form to be sent to the server
//                 let updated_filename = await handle_new_image(webpage_name, input, imageNames);
//                 // Add file url to webpage data
//                 let img_url = `/images/${webpage_name}/${updated_filename}`;
//                 webpage["articles"][i]["images"].push(img_url);
//             }
//         }
//     }

//     return imageNames;
}


const handle_new_video = async (webpage_name, input, videoNames) => {
    let videoData = new FormData();
    videoData.append("webpage", webpage_name);
    videoData.append("media", "video");
    let filename = input.files[0].name;

    // If there is no conflict
    if (!videoNames.includes(filename)) {
        // Add file to video form
        videoData.append("video", input.files[0]);
    }
    // If there is conflict
    else {
        // Generate new unique filename
        let parts_of_filename = input.files[0].name.split(".");
        let primary_filename = "";
        for (let i = 0; i < parts_of_filename.length - 1; i++) {
            primary_filename += parts_of_filename[i] + ".";
        }
        let file_extension = parts_of_filename.slice(-1)[0];
        filename = primary_filename + file_extension;
        let i = 1;
        while (videoNames.includes(filename)) {
            filename = `${primary_filename}${i}.${file_extension}`;
            i++;
        }

        // Make new file with new filename
        let file = new File([input.files[0]], filename, {
            type: input.files[0].type,
            lastModified: input.files[0].lastModified
        });

        // Add file to video form
        videoData.append("video", file);
    }

    // Post new video to server and get filename
    // The server checks if an old video that was deleted in this session and a new video added in this session has the same filename.
    let url = "/protected/videos";
    let updated_filename = await apiRequest("POST", url, videoData, "formData");

    // Adds updated filename to the array videoNames to keep track of new names.
    videoNames.push(updated_filename);
    return updated_filename;
}



const handle_videos = async (webpage, articles) => {
    let webpage_name = webpage["id"].slice(0, -5);
    // For resolving name conflicts, we store vid names in the array below.
    let videoNames = [];
    // To resolve video file naming conflict on the client side, we want to get all video names first.
    let video_containers = document.querySelectorAll("main .video-container");

    // If input is empty, it could mean 2 things:
    //      1) There is no video assigned.
    //      2) There is a video but it was assigned before this session.
    // If input is not empty, then the video was assigned in this session.
    //
    // To resolve naming conflicts, we need to know the old video names first before the new video names because
    //  1) We can assume that old video names do not have naming conflicts amongst themselves.
    //  2) We do not have access to old video files (server sends us data urls) so changing their name is only possible on the server side.
    //
    // So, we loop over all inputs to get old video names first
    // We resolve video name conflicts for new videos later as we are posting the videos to the server.
    // Loop one for gathering old video names exclusively
    for (let video_container of video_containers) {
        let input = video_container.querySelector("input");
        if (input.value === "") {
            let elem = video_container.querySelector(".video");
            // If its an old video, it will be a node object.
            // If it is empty, it will null.
            if (elem !== null) {
                // Url stored in src attribute of vid is a dataurl, so we get url from the tag after it,
                // which is where we saved it whien loading the page.
                let url = video_container.querySelector(".vid-url").textContent;
                let filename = url.split("/").slice(-1)[0];
                videoNames.push(filename);
            }
        }
    }
    // Add bg video name if it exists.
    let input = document.querySelector(".bg-vid-input");
    if (input.value === "" && background_video !== "") {
        let filename = background_video.split("/").slice(-1)[0];
        videoNames.push(filename);
    }

    // Loop 2 for:
    //  1) Resolving name conflicts.
    //  2) Saving videos to server.
    //  3) Adding video data to the data that will be sent to the server.
    for (let i = 0; i < articles.length; i++) {
        let article = articles[i];
        webpage["articles"][i]["videos"] = []; // This is the article_obj["videos"]

        let video_containers = article.querySelectorAll(".video-container");
        for (let video_container of video_containers) {
            let input = video_container.querySelector("input");
            let elem = video_container.querySelector(".video");

            // If it's an old video
            if (input.value === "" && elem !== null) {
                // Add file url to webpage data
                let url_holder = video_container.querySelector(".vid-url");
                let url = url_holder.textContent;
                webpage["articles"][i]["videos"].push(url);
            }

            // If it's not assigned an video
            else if (input.value === "" && elem === null) {
                // Add empty string in place of file url to webpage data
                webpage["articles"][i]["videos"].push("");
            }

            // If it's a new video
            else {
                // Create video form to be sent to the server
                let updated_filename = await handle_new_video(webpage_name, input, videoNames);
                // Add file url to webpage data
                let vid_url = `/videos/${webpage_name}/${updated_filename}`;
                webpage["articles"][i]["videos"].push(vid_url);
            }
        }
    }

    return videoNames;
}



// The following code body is for the page background image, which is handled separately from the rest of the images.
const handle_bg_image = async (webpage, imageNames) => {
    let webpage_name = webpage["id"].slice(0, -5);
    let input = document.querySelector(".bg-img-input");

    // If new image has been selected
    if (input.value !== "") {
        // Create image form to be sent to the server
        let updated_filename = await handle_new_image(webpage_name, input, imageNames);
        
        // Add file url to webpage data
        let img_url = `/images/${webpage_name}/${updated_filename}`;
        webpage["background"]["image"] = img_url;
        console.log("1");
        console.log(webpage["background"]["image"]);
    }
    // If existing bg image is the bg
    else if (background_image !== "") {
        webpage["background"]["image"] = background_image;
        console.log(webpage["background"]["image"]);
    }
    // If no bg image has been specified
    else {
        webpage["background"]["image"] = "";
    }
}

// The following code body is for the page background video, which is handled separately from the rest of the videos.
const handle_bg_video = async (webpage, videoNames) => {
    let webpage_name = webpage["id"].slice(0, -5);
    let input = document.querySelector(".bg-vid-input");
    
    // If new video has been selected
    if (input.value !== "") {
        // Create video form to be sent to the server
        let updated_filename = await handle_new_video(webpage_name, input, videoNames);

        // Add file url to webpage data
        let vid_url = `/videos/${webpage_name}/${updated_filename}`;
        webpage["background"]["video"] = vid_url;
    }
    // If existing bg video is the bg
    else if (background_video !== "") {
        webpage["background"]["video"] = background_video;
    }
    // If no bg video has been specified
    else {
        webpage["background"]["video"] = "";
    }
}

const handle_bg_color = (webpage) => {
    webpage["background"]["color"] = background_color;
}

// Saves webpage info as JSON in MondoDB
async function saveWebpage () {
    // Collect webpage data in an object/dict/map
    let webpage = {}
    // webpage id is the file name for the current html.
    let id = location.href.split("/").slice(-1)[0];
    id = id.split("#").slice(0, 1)[0];


    handle_basic_webpage_info(webpage, id);

    // Get info for each article and add them to the webpage data.
    // Image data will be handled separately due to its complexity.
    // Make text editable for when save is called from edit sidebar, which does not do this earlier.
    // If we do not do this, the code for saving texts will not work.
    let articles = handle_article_info(webpage);

    // Add image data.
    // Handling images is complicated. So, we will use a separate loop to make things cleaner.
    let imageNames = await handle_images(webpage, articles);
    let videoNames = await handle_videos(webpage, articles);

    // Add page background data.
    webpage["background"] = {};
    await handle_bg_image(webpage, imageNames);
    await handle_bg_video(webpage, videoNames);
    handle_bg_color(webpage);

    // Patch data to database.
    let url = "/protected/webpages/" + id;
    console.log(url);
    let res = await apiRequest("PATCH", url, webpage);
    console.log(res);
}


// To retrieve info correctly.
const prepare_webpage = () => {
    // Template 11
    let team_members = document.querySelectorAll(".template-11.article .team-members");

    for (let i = 0; i < team_members.length; i++) {
        let children = team_members[i].children;
        let last_child = children[children.length - 1];
        console.log(last_child);
        if (typeof last_child !== "undefined" && last_child.querySelector(".member-info") !== null) {
            last_child.remove();
        }
    }
}


// Patch data
const enable_save_page = () => {
    // Save Edits
    let save = document.querySelector("#save-webpage");
    save.addEventListener("click", async () => {
        // To retrieve info correctly
        prepare_webpage();
        await saveWebpage();
        // We do not simple use location.reload because the location may have an anchor that is no longer pre
        // window.location.href=document.location.href.match(/(^[^#]*)/)[0];
    });

//     // Cancel Edits
//     let cancel = document.querySelector("#cancel_changes");
//     cancel.addEventListener("click", () => {
//         window.location.href=document.location.href.match(/(^[^#]*)/)[0];
//     });
}


// ###################################################################################################
// Helper Function: Delete Page Functionality
// ###################################################################################################


// const finishDeletePage = async () => {
//     let page_name = sessionStorage.getItem("Delete Page");
//     if (page_name !== null) {
//         let res = await apiRequest("GET", "/protected/webpages/" + page_name);
//         sessionStorage.removeItem("Delete Page");

//         if (res["Page Exists"] === true) {
//             let url = "/protected/webpages/" + page_name;
//             await apiRequest("DELETE", url, {});
//         }
//     }
// }


const startDeletePage = async () => {
    let file_name = location.href.split("/").slice(-1)[0];
    file_name = file_name.split("#").slice(0, 1)[0];
    let res = await apiRequest("GET", "/protected/webpages/" + file_name);

    if (res["Page Exists"] === true) {
        let url = "/protected/webpages/" + file_name;
        let response = await apiRequest("DELETE", url, {});
        // console.log(response);
        if (response["Message"] === "Success") {
            window.location.href = "/index.html";
        }
        else {
            console.log(response["Message"]);
            alert(response["Message"]);
        }
    }
}


const enable_delete_page = () => {
    // finishDeletePage();
    let delete_button = document.querySelector("#delete-page");
    delete_button.addEventListener("click", startDeletePage);
}


// ###################################################################################################
// Helper Function: Editing Navigation Bar Functionality
// ###################################################################################################

// TODO: Don't pass around global variables as parameters. It affects performance.

// Keeps track of [display name, url, webpage name], even if not included in the nav bar.
let primary_nav_cache;
let secondary_nav_cache;
const MAX_NAV_LINKS = 10;


const initialize_edit_nav_bar_button = () => {
    let button = document.querySelector("#edit-nav-bar");
    button.addEventListener("click", () => {
        let edit_nav_dialog = document.querySelector("#edit-nav-dialog");
        let dialog_box_container = edit_nav_dialog.closest(".dialog-box-container");
        dialog_box_container.style.visibility = "visible";
    });
}


const move_item_between_lists = (list1, list2) => {
    let items = [];
    let increase_rank = 0;
    for (let option of list1.options) {
        if (option.selected) {
            items.push(option);
            increase_rank++;
        }
        option.value -= increase_rank;
    }
    let length = list2.options.length;
    for (let i = 0; i < items.length; i++) {
        items[i].value = length + i + 1;
        items[i].remove();

        list2.append(items[i]);
    }
}


const list_size_exceeded = (list1, list2) => {
    let num_of_nav_links = list2.options.length + list1.selectedOptions.length;
    return (num_of_nav_links > MAX_NAV_LINKS);
}


const prepare_include_exclude_buttons = (navbar, nav_cache, list1_id, list2_id) => {
    let list1 = document.querySelector(list1_id);
    let list2 = document.querySelector(list2_id);
    let button = document.querySelector(`${navbar} .include`);
    button.addEventListener("click", () => {
        if (list_size_exceeded(list1, list2)) {
            return;
        }
        move_item_between_lists(list1, list2);
        update_nav_display_names(navbar, nav_cache);
    });

    button = document.querySelector(`${navbar} .exclude`);
    button.addEventListener("click", () => {
        move_item_between_lists(list2, list1);
        update_nav_display_names(navbar, nav_cache);
    });
}


const prepare_nav_lists = async (nav_data, webpages, list1_id, list2_id) => {
    let included_webpages = [];
    for (let link of nav_data) {
        let webpage = link[1].split("/").slice(-1)[0];
        included_webpages.push(webpage);
    }

    let list1 = document.querySelector(list1_id);
    let list2 = document.querySelector(list2_id);
    list1.textContent = "";
    list2.textContent = "";

    for (let webpage of webpages) {
        let option = document.createElement("option");
        option.textContent = webpage;
        if (included_webpages.includes(webpage)) {
            option.value = list2.options.length + 1;
            list2.append(option);
        }
        else {
            list1.append(option);
        }
    }
}


const apply_changes_to_nav = async () => {
    // Get display names and send it to server along with their filenames.
    // Keep a list of core html files in the database.
    // If the filename is not included in the list of core files, then it is in 'html-not-core' directory.
    let navbar_update = {
        "primary_navbar" : [],
        "secondary_navbar" : []
    };

    // This query search is orderd.
    let navbar_table_labels = document.querySelectorAll("#primary-nav-display-list label");
    for (let label of navbar_table_labels) {
        let webpage_name = label.textContent;
        if (webpage_name !== "") {
            navbar_update["primary_navbar"].push(primary_nav_cache[webpage_name]);
        }
    }

    // navbar_table_labels = document.querySelector("#secondary-nav-display-list label");
    // for (let label in navbar_table_labels) {
    //     let webpage_name = label.textContent;
    //     if (webpage_name !== "") {
    //         navbar_update["secondary_navbar"].push(secondary_nav_cache[webpage_name]);
    //     }
    // }

    let webpage_name = location.href.split("/").slice(-1)[0];
    webpage_name = webpage_name.split("#").slice(0, 1)[0];
    let res = await apiRequest("PATCH", `/protected/navbars/${webpage_name}`, navbar_update);
}


const update_nav_display_names = (nav_bar, nav_cache) => {
    let list = document.querySelector(`${nav_bar} .included-links`);
    let num_of_rows = document.querySelector(`${nav_bar} table`).rows.length;
    // Wipe prior data off the table
    for (let i = 1; i < num_of_rows; i++) {
        let label = document.querySelector(`${nav_bar} .row-${i} label`);
        if (i > 1 && label.textContent === "") {
            // Make move down button visible if it was made hidden.
            let button = document.querySelector(`${nav_bar} .row-${i-1} .move_down`);
            button.style.visibility = null;
            button.style.maxWidth = "none";
            // button.style.display = "static";
            break;
        }
        label.textContent = "";
        let input = document.querySelector(`${nav_bar} .row-${i} input`);
        input.value = "";
    }
    // Add current data to table
    for (let option of list.options) {
        let rank = option.value;
        let row = docuent.querySelector(`${nav_bar} .row-${rank}`);
        let label = row.querySelector("label");
        let webpage_name = option.textContent;
        label.textContent = webpage_name;
        let input = row.querySelector("input");
        input.value = nav_cache[webpage_name][0];
        row.style.visibility = "inherit";
        // row.style.maxHeight = "none";
        // row.style.dispaly = "static";
    }
    // Hide extra rows
    for (let i = 1; i < num_of_rows; i++) {
        let row = document.querySelector(`${nav_bar} .row-${i}`);
        let webpage_name = row.querySelector("label").textContent;
        if (webpage_name === "") {
            // row.style.display = "none";
            row.style.visibility = "hidden";
            // row.style.maxHeight = "0px";
        }
    }
    // Hide the move down button for the last row
    let num_of_included_links = list.options.length;
    if (num_of_included_links > 0 && num_of_included_links < num_of_rows - 1) {
        let button = document.querySelector(`${nav_bar} .row-${num_of_included_links} .move_down`);
        button.style.visibility = "hidden";
        button.style.maxWidth = "0px";
        // button.style.display = "none";
    }
    
}


const prepare_apply_button = () => {
    let apply_button = document.querySelector("#handle-navbar-changes .save");
    apply_button.addEventListener("click", () => {
        apply_changes_to_nav();
        // apply_changes_to_nav(#secondry...blah..blah..blah);
        location.reload();
    });
}


const prepare_cancel_button = () => {
    let cancel_button = document.querySelector("#edit-nav-dialog .cancel");
    cancel_button.addEventListener("click", () => {
        reset_navbar_dialog_box();
        let edit_nav_dialog = document.querySelector("#edit-nav-dialog");
        let dialog_box_container = edit_nav_dialog.closest(".dialog-box-container");
        dialog_box_container.style.visibility = "hidden";
    });
}


const reset_navbar_dialog_box = async () => {
    let webpage_name = location.href.split("/").slice(-1)[0];
    webpage_name = webpage_name.split("#").slice(0, 1)[0];
    let primary_nav_data = await apiRequest("GET", "/navbars");
    // let secondary_nav_data = await apiRequest("GET", `/navbars/${webpage_name}`);
    let urls = await apiRequest("GET", "/protected/urls");

    primary_nav_cache = initialize_nav_cache(primary_nav_data, urls);
    // secondary_nav_cache = initialize_nav_cache(secondary_nav_data, urls);

    let webpages = await apiRequest("GET", "/protected/webpages");
    prepare_nav_lists(primary_nav_data, webpages, "#select1", "#select2");
    // prepare_nav_lists(secondary_nav_data, webpages, "#select3", "#select4");

    update_nav_display_names("#primary-nav-control-panel", primary_nav_cache);
    // update_nav_display_names("#secondary-nav-control-panel", secondary_nav_cache);
}


// To keep track of display name in global variable.
const initialize_nav_cache = (nav_data, urls) => {
    // let nav_cache = new Set();
    let nav_cache = {};
    let included_webpages = [];
    // for (let link of nav_data) {
    //     link.push(link[1].split("/").slice(-1)[0]);
    //     nav_cache.add(link);
    //     included_webpages.push(link[1]);
    // }
    for (let link of nav_data) {
        let webpage_name = link[1].split("/").slice(-1)[0];
        nav_cache[webpage_name] = link;
        included_webpages.push(link[1]);
    }
    // for (let url of urls) {
    //     if (!included_webpages.includes(url)) {
    //         let link = ["", url, url.split("/").slice(-1)[0]]
    //         nav_cache.add(link);
    //     }
    // }
    console.log("url", urls);
    for (let url of urls) {
        if (!included_webpages.includes(url)) {
            let link = ["", url]
            let webpage_name = url.split("/").slice(-1)[0];
            nav_cache[webpage_name] = link;
        }
    }
    return nav_cache;
}


const prepare_move_up_buttons = () => {
    let buttons = document.querySelectorAll(".move_up");
    for (let button of buttons) {
        button.addEventListener("click", (event) => {
            // Initialize variables
            let button_1 = event.currentTarget;
            let input_1 = button_1.closest("td").previousElementSibling;
            let label_1 = input_1.previousElementSibling;
            let rank_1 = label_1.previousElementSibling.textContent;
            let webpage_name_1 = label_1.textContent;

            let button_2 = button_1.closest("tr").previousElementSibling.querySelector("button");
            let input_2 = button_2.closest("td").previousElementSibling;
            let label_2 = input_2.previousElementSibling;
            let rank_2 = label_2.previousElementSibling.textContent;
            let webpage_name_2 = label_2.textContent;

            // Swap labels and inputs, effectively swapping the two rows
            label_1.remove();
            label_2.before(label_1);

            label_2.remove();
            input_1.before(label_2);

            input_1.remove();
            button_2.closest("td").before(input_1);

            input_2.remove();
            button_1.closest("td").before(input_2);

            // Transfer updated ordering data to nav_lists
            let nav_control = button_1.closest("table").previousElementSibling;
            let list = nav_control.querySelector(".included-links");
            for (let option of list.options) {
                if (option.textContent === webpage_name_1) {
                    option.value = rank_2;
                }
                if (option.textContent === webpage_name_2) {
                    option.value = rank_1;
                }
            }
        });
    }
}


const prepare_move_down_buttons = () => {
    let buttons = document.querySelectorAll(".move_down");
    for (let button of buttons) {
        button.addEventListener("click", (event) => {
            // Initialize variables
            let button_1 = event.currentTarget;
            let input_1 = button_1.closest("td").previousElementSibling;
            let label_1 = input_1.previousElementSibling;
            let rank_1 = label_1.previousElementSibling.textContent;
            let webpage_name_1 = label_1.textContent;

            let button_2 = button_1.closest("tr").nextElementSibling.querySelector("button");
            let input_2 = button_2.closest("td").previousElementSibling;
            let label_2 = input_2.previousElementSibling;
            let rank_2 = label_2.previousElementSibling.textContent;
            let webpage_name_2 = label_2.textContent;

            // Swap labels and inputs, effectively swapping the two rows
            label_1.remove();
            label_2.before(label_1);

            label_2.remove();
            input_1.before(label_2);

            input_1.remove();
            button_2.closest("td").before(input_1);

            input_2.remove();
            button_1.closest("td").before(input_2);

            // Transfer updated ordering data to nav_lists
            let nav_control = button_1.closest("table").previousElementSibling;
            let list = nav_control.querySelector(".included-links");
            for (let option of list.options) {
                if (option.textContent === webpage_name_1) {
                    option.value = rank_2;
                }
                if (option.textContent === webpage_name_2) {
                    option.value = rank_1;
                }
            }
        });
    }
}


const prepare_input_fields = (navbar, nav_cache) => {
    let inputs = document.querySelectorAll(`${navbar} input`);
    for (let input of inputs) {
        input.addEventListener("input", (event) => {
            let webpage_name = event.currentTarget.parentElement.previousElementSibling.querySelector("label").textContent;
            nav_cache[webpage_name][0] = event.currentTarget.value;
        });
    }
}


// TODO: Make wrapper functions to give less arguments?
const enable_edit_nav_bar = async () => {
    // Adds nav bar data
    await reset_navbar_dialog_box();

    // Makes Navbar Control buttons work
    initialize_edit_nav_bar_button();
    
    prepare_include_exclude_buttons("#primary-nav-control-panel", primary_nav_cache, "#select1", "#select2");
    prepare_include_exclude_buttons("#secondary-nav-control-panel", secondary_nav_cache, "#select3", "#select4");

    prepare_move_up_buttons();
    prepare_move_down_buttons();

    prepare_input_fields("#primary-nav-display-list", primary_nav_cache);

    prepare_apply_button();
    prepare_cancel_button();
}


// ###################################################################################################
// Helper Function: Enabeling/Disabeling Sidebar Functionality
// ###################################################################################################


// const make_header_editable = () => {
//     let header = document.querySelector(".sidebar h2");
//     header.setAttribute("contenteditable", "true");
// }


const insert_add_navlink_button = () => {
    let button = document.createElement("button");
    let button_container = document.createElement("div");
    button.classList.add("add-navlink");
    button_container.classList.add("button-container");
    button.textContent = "Add Navlink";

    let navbar = document.querySelector(".tertiary-navbar ul");
    button_container.append(button);
    navbar.append(button_container);

    button.addEventListener("click", (event) => {
        let dialog = document.querySelector("#add-navlink-dialog");
        let dialog_box_container = dialog.closest(".dialog-box-container");
        dialog_box_container.style.visibility = "visible";
    });
}


// Hides "Add Link" Dialog box and deletes inputs entered.
const hideAddNavlinkDialog = () => {
    let dialog = document.querySelector("#add-navlink-dialog");
    let dialog_box_container = dialog.closest(".dialog-box-container");
    dialog_box_container.style.visibility = "hidden";
    let inputs = dialog.querySelectorAll("input");
    for (let input of inputs) {
        input.value = "";
    }
}


const deleteNavlink = (event) => {
    let del_button = event.currentTarget;
    let link = del_button.closest("li");
    link.remove();
}


const add_delete_navlink_button = (div) => {
    // Add delete link button
    let delete_link = document.createElement("button");
    let span = document.createElement("span");
    span.classList.add("material-icons");
    delete_link.classList.add("delete-navlink-button");
    span.textContent = "delete";

    delete_link.append(span);
    delete_link.addEventListener("click", deleteNavlink);
    div.append(delete_link);
}


// Adds a link to the button.
const addNavlink= () => {
    let a = document.createElement("a");

    let button_label = document.querySelector("#navlink-name");
    let button_link = document.querySelector("#nav-URL");

    let div = document.createElement("div");
    let li = document.createElement("li");
    a.textContent = button_label.value;
    a.href = button_link.value;
    div.classList.add("button-navlink");
    div.append(a);
    li.append(div);
    
    let nav_button_container = document.querySelector(".tertiary-navbar ul .button-container");
    nav_button_container.before(li);
    hideAddNavlinkDialog();

    add_delete_navlink_button(div);
}


const get_article_id = (event) => {
    let elem = event.target;

    let article = elem.closest(".article");
    if (article !== null) {
        let dialog = document.querySelector("#add-navlink-dialog");
        let dialog_box_container = dialog.closest(".dialog-box-container");
        dialog_box_container.style.visibility = "visible";

        document.removeEventListener("click", get_article_id);

        let button_link = document.querySelector("#nav-URL");
        button_link.value = `#${article.id}`;
    }
}


const prepare_add_navlink_dialog = () => {
    // Make "Add Navlink" dialog box work
    let save_link = document.querySelector("#add-navlink-dialog .save");
    let do_not_save_link = document.querySelector("#add-navlink-dialog .cancel");
    let generate_link = document.querySelector("body .generate-link");
    save_link.addEventListener("click", addNavlink);
    do_not_save_link.addEventListener("click", hideAddNavlinkDialog);


    generate_link.addEventListener("click", () => {
        let dialog = document.querySelector("#add-navlink-dialog");
        let dialog_box_container = dialog.closest(".dialog-box-container");
        dialog_box_container.style.visibility = "hidden";

        document.addEventListener("click", get_article_id);
    });
}


// Make add-link button work
// const prepare_add_navlink_buttons = (article) => {
//     let add_link_buttons = article.querySelectorAll(".add-navlink");
//     for (let add_link_button of add_link_buttons) {
//         add_link_button.style.display = "flex";
//         add_link_button.addEventListener("click", invokeAddNavlink);
//     }
// }


const prepare_delete_navlink_buttons = () => {
    let links = document.querySelectorAll(".button-navlink");
    for (let div of links) {
        add_delete_navlink_button(div);
    }
}


// Invokes the dialog box that allows you to add a link to the button.
// const invokeAddNavlink = (event) => {
//     let add_navlink_dialog = document.querySelector("#add-navlink-dialog");
//     add_navlink_dialog.style.visibility = "visible";
//     link_button = event.currentTarget;
// }



// const prepare_edit_sb_but = (edit_sidebar_button) => {
//     edit_sidebar_button.addEventListener("click", () => {
//         make_header_editable();
//         insert_add_navlink_button();
//         prepare_add_navlink_dialog();
//         prepare_delete_navlink_buttons();
//         update_admin_buttons("#admin-controls", "#save-cancel");
//     });
// }



// const sidebar_exists = () => {
//     let main = document.querySelector("main");
//     if (main.querySelector(".sidebar") !== null) {
//         return true;
//     }
//     else {
//         return false;
//     }
// }


// const add_or_delete_sidebar = async (sidebar) => {
//     // Get data of current webpage
//     let id = location.href.split("/").slice(-1)[0];
//     id = id.split("#").slice(0, 1)[0];
//     let webpage = await apiRequest("GET", "/webpages/" + id);

//     // Update the data to reflect the inclusion of a sidebar.
//     webpage["sidebar"] = sidebar;
//     webpage["sidebar_title"] = "Navigation Pane";

//     // Patch data to database.
//     let url = "/protected/webpages/" + id;
//     console.log(url);
//     let res = await apiRequest("PATCH", url, webpage);
//     console.log(res);

//     location.reload();
// }


// const prepare_mk_sb_but = (make_sidebar_button) => {
//     make_sidebar_button.addEventListener("click", () => {
//         add_or_delete_sidebar([["This Webpage", location.href]]);
//     });
// }


// const prepare_del_sb_but = (delete_sidebar_button) => {
//     delete_sidebar_button.addEventListener("click", () => {
//         add_or_delete_sidebar([]);
//     });
// }


// const enable_edit_sidebar = () => {
//     let make_sidebar_button = document.querySelector("#make-sidebar");
//     let delete_sidebar_button = document.querySelector("#delete-sidebar");
//     let edit_sidebar_button = document.querySelector("#edit-sidebar");

//     prepare_mk_sb_but(make_sidebar_button);
//     prepare_del_sb_but(delete_sidebar_button);
//     prepare_edit_sb_but(edit_sidebar_button);

//     if (sidebar_exists()) {
//         make_sidebar_button.style.display = "none";
//     }
//     else {
//         delete_sidebar_button.style.display = "none";
//         edit_sidebar_button.style.display = "none";
//     }
// }



// ###################################################################################################
// ########################################## Main Function ##########################################
// ###################################################################################################

const add_admin_features = () => {
    let main = document.querySelector("main");
    let main_content_area = main.querySelector(".main-content");
    let articles_container;
    if (main_content_area === null) articles_container = main;
    else articles_container = main_content_area;
    let sidebar_container = main.querySelector(".sidebar"); // TODO Figure out what sidebar container is after analyzing how this info is used in editMenu.
    let dialog_boxes_container = document.querySelector('#temporary');
    new EditMenu(webpage_data).install(document.body, articles_container, sidebar_container, dialog_boxes_container);


    // show_admin_controls();
    // enable_make_new_page();
    // enable_edit_page();
    // enable_save_page();
    // enable_delete_page();
    // enable_edit_nav_bar();
    // enable_edit_sidebar();
}



