// Uses "api.js" to make requests to the server.

import apiRequest from "./api.js";
import add_admin_features from "./admin-features.js";

const ADD_IMG_PIC = "/images/editable-page/add-image.svg"

// Select Template and clone it.
const clone_template_for_section = (template_id) => {
    let query = "#hidden ." + template_id;
    let selected_template = document.querySelector(query);
    let article = selected_template.cloneNode(true);
    return article;
}


const add_heading = (article, heading_data) => {
    let heading = article.querySelector(".article-title");
    heading.textContent = heading_data;
    return article;
}


const prepare_template_11 = (article, num_of_members) => {

    let team_members = article.querySelector(".team-members");

    for (let i = 0; i < num_of_members; i++) {
        let new_team_member = document.createElement("div");
        let new_image_container = document.createElement("div");
        let member_info = document.createElement("div");

        let new_input = document.createElement("input");
        let new_button = document.createElement("button");
        let new_url_holder = document.createElement("p");
        let new_img = document.createElement("img");
        let name = document.createElement("h3");
        let designation = document.createElement("p");


        team_members.prepend(new_team_member);

        new_team_member.append(new_image_container);
        new_team_member.append(member_info);

        new_image_container.append(new_input);
        new_image_container.append(new_button);
        new_image_container.append(new_url_holder);
        new_button.append(new_img);

        member_info.append(name);
        member_info.append(designation);


        new_team_member.classList.add("team-member");

        new_image_container.classList.add("image-container");
        member_info.classList.add("member-info", "text-container");

        new_input.setAttribute("type", "file");
        new_input.setAttribute("accept", "image/*");
        new_button.classList.add("add-image");
        new_img.setAttribute("src", ADD_IMG_PIC);
        new_url_holder.classList.add("img-url");
        name.classList.add("article-subheading");
        designation.classList.add("article-text");
    }
    return article;
}


const add_subheadings = (article, subheadings_data) => {
    if (subheadings_data.length != 0) {
        let subheadings = article.querySelectorAll(".article-subheading");
        for (let i = 0; i < subheadings.length; i++) {
            subheadings[i].textContent = subheadings_data[i];
        }
    }
    return article;
}


const add_texts = (article, texts_data) => {
    let texts = article.querySelectorAll(".article-text");
    for (let i = 0; i < texts.length; i++) {
        texts[i].innerHTML = texts_data[i][0];
        for (let j = 1; j < texts_data[i].length; j++) {
            texts[i].innerHTML += "<br>";
            texts[i].innerHTML += texts_data[i][j];
        }
    }
    return article;
}

// const add_texts = (article, texts_data) => {
//     let texts = article.querySelectorAll(".article-text");
//     for (let i = 0; i < texts.length; i++) {
//         for (let j = 0; j < texts_data[i]; j++) {
//             texts[i].textContent = texts_data[i];
//         }
        
//     }
//     return article;
// }

const add_images = (article, images_data) => {
    let image_containers = article.querySelectorAll(".image-container");

    for (let i = 0; i < images_data.length; i++) {
        let url = images_data[i];

        if (url !== "") {
            let img_button = image_containers[i].querySelector(".add-image");
            let img = document.createElement("img");
            img.setAttribute("src", url);
            img.classList.add("image");

            img_button.replaceWith(img);
            
            let url_holder = image_containers[i].querySelector(".img-url");
            url_holder.textContent = url;
        }
    }
    return article;
}


const add_links = (article, links_data) => {
    let links = article.querySelectorAll(".add-link");

    for (let i = 0; i < links_data.length; i++) {
        for (let link of links_data[i]) {
            let a = document.createElement("a");
            a.textContent = link["text"];
            a.href = link["url"];
            
            let div = document.createElement("div");
            div.append(a);
            div.classList.add("button-link");

            links[i].before(div);
        }
    }
    return article;
}


const edit_template_11 = (article) => {
    let images = article.querySelectorAll(".image");
    for (let image of images) {
        image.classList.add("member-photo");
    }
    // Hides add new member button.
    // let add_new_member_button = article.querySelector(".add_member");
    // add_new_member_button.style.display = "none";
    return article;
}


// Adds Sections above Footer
const addSection = (article_data) => {
    // Select Template and clone it.
    let article = clone_template_for_section(article_data.template);
    article.id = article_data.article_id;
    
    // Prepare article structure for specific templates.
    if (article_data.template == "template-11") {
        article = prepare_template_11(article, article_data.subheadings.length);
    }

    // Add data into it.
    article = add_heading(article, article_data.heading);
    article = add_subheadings(article, article_data.subheadings);
    article = add_texts(article, article_data.texts);
    article = add_images(article, article_data.images);
    article = add_links(article, article_data.links);
    article.classList.add("article");
    
    // Edit parts of specific template after filling it with data.
    if (article_data.template == "template-11") {
        article = edit_template_11(article);
    }
    
    // Add the node to html
    let main = document.querySelector("main");
    let main_content_area = main.querySelector(".main-content");
    if (main_content_area === null) {
        main.append(article);
    }
    else {
        main_content_area.append(article);
    }
}


async function load_primary_navbar() {
    let primary_nav_bar = await apiRequest("GET", "/navbars");
    let insertBefore = document.querySelector("#login-leaf");
    for (let link of primary_nav_bar) {
        let li = document.createElement("li");
        li.classList.add("leaf");

        let a = document.createElement("a");
        a.textContent = link[0];
        a.setAttribute("href", link[1]);

        li.append(a);
        insertBefore.before(li);
    }
}


async function load_sidebar(id) {
    let webpage = await apiRequest("GET", "/webpages/" + id);
    if (webpage["sidebar"].length > 0) {
        let sidebar = document.querySelector(".display-area").cloneNode(true);
        let main = document.querySelector("main");
        main.append(sidebar);

        let sidebar_title = sidebar.querySelector(".sidebar-title");
        sidebar_title.textContent = webpage["sidebar_title"];

        let navlinks = sidebar.querySelector(".tertiary-navbar ul");
        for (let link of webpage["sidebar"]) {
            let a = document.createElement("a");
            let div = document.createElement("div");
            let li = document.createElement("li");

            a.textContent = link[0];
            a.href = link[1];

            div.classList.add("button-navlink");
            div.append(a);
            li.append(div);
            navlinks.append(li);
        }
    }
    return webpage;
}


function load_webpage_data(webpage) {
    let page_title = document.querySelector("#page-title h1");
    if (page_title !== null) { // Login page does not have page_title.
        page_title.textContent = webpage["title"];
    }
    let articles = webpage["articles"];
    for (let article of articles) {
        addSection(article);
    }
}


async function load_webpage() {
    let id = location.href.split("/").slice(-1)[0];
    if (id === "") {
        location.href = location.href + "index.html";
    }    

    await load_primary_navbar();
    // Load Secondary Nav Bar
    // let secondary_nav_bar = await apiRequest();

    // If login page, do not execute the rest of the code
    if (id !== "login.html") {
        let webpage = await load_sidebar(id);
        load_webpage_data(webpage);
    }

    /* We run this here because some functions in admin_features depend on the webpage data being loaded, which happens here.
    *  If we don't do this, then the admin features get loaded before webpage data is loaded, which interferes with functionality.
    *  For instance, the "new section" button won't appear in all the places because of missing webpage data.
    */
    add_admin_features();
}

load_webpage();






