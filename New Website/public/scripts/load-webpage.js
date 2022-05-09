// Uses "api.js" to make requests to the server.

import apiRequest from "./api.js";
import add_admin_features from "./admin-features.js";


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
        texts[i].textContent = texts_data[i];
    }
    return article;
}


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


// Adds Sections above Footer
const addSection = (article_data) => {
    // Select Template and clone it.
    let article = clone_template_for_section(article_data.template);
    
    // Add data into it.
    article = add_heading(article, article_data.heading);
    article = add_subheadings(article, article_data.subheadings);
    article = add_texts(article, article_data.texts);
    article = add_images(article, article_data.images);
    article = add_links(article, article_data.links);
    article.classList.add("article");
    
    // Add the node to html
    let main = document.querySelector("main");
    main.append(article);
}


async function load_webpage() {
    let id = location.href.split("/").slice(-1)[0];
    if (id === "") {
        location.href = location.href + "index.html";
    }    

    // Load Primary Nav Bar
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

    // Load Secondary Nav Bar
    // let secondary_nav_bar = await apiRequest();

    // Load Webpage data
    let webpage = await apiRequest("GET", "/webpages/" + id);
    let page_title = document.querySelector("#page-title h1");
    if (page_title !== null) { // Login page does not have page_title.
        page_title.textContent = webpage["title"];
    }
    let articles = webpage["articles"];
    for (let article of articles) {
        addSection(article);
    }


    /* We run this here because some functions in admin_features depend on the webpage data being loaded, which happens here.
    *  If we don't do this, then the admin features get loaded before webpage data is loaded, which interferes with functionality.
    *  For instance, the "new section" button won't appear in all the places because of missing webpage data.
    */
    add_admin_features();
}

load_webpage();