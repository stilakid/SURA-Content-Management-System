import apiRequest from "./api.js";

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
    console.log(webpage);
    console.log(JSON.stringify(webpage));

    // Patch this webpage to server!!!
    // variable = await apiRequest(method, path, body);

    let id = location.href.split("/").slice(-1)[0];
    let url = "/webpages/" + id;
    await apiRequest("PATCH", url, webpage);
}

// Adds Sections above Footer
const addSection = (article_data) => {
    // Select Template and clone it.
    let template_id = article_data.template;
    let query = "#hidden ." + template_id;
    let selected_template = document.querySelector(query);
    let article = selected_template.cloneNode(true);

    // Add data into it.
    article.classList.add("article");
    let heading_data = article_data.heading;
    let subheadings_data = article_data.subheadings;
    let texts_data = article_data.texts;
    let images_data = article_data.images;
    let links_data = article_data.links;

    let heading = article.querySelector(".article-title");
    heading.textContent = heading_data;

    if (subheadings_data.length != 0) {
        let subheadings = article.querySelectorAll(".article-subheading");
        for (let i = 0; i < subheadings.length; i++) {
            subheadings[i].textContent = subheadings_data[i];
        }
    }
    
    let texts = article.querySelectorAll(".article-text");
    for (let i = 0; i < texts.length; i++) {
        texts[i].textContent = texts_data[i];
    }

    // ADD IMAGES HERE

    // ADD LINKS HERE
    if (links_data.length != 0) {
        let links = article.querySelectorAll(".add-link");
    }
    

    // Add the node to html
    let main = document.querySelector("main");
    main.append(article);
}

async function setupComWithServer () {
    // Load data
    let id = location.href.split("/").slice(-1)[0];
    /*
    Expect: {"id":"editable-page.html","articles":[{"template":"template-10","heading":"Heading Goes Here","texts":"Enter text here"},{"template":"template-1","heading":"Heading Goes Here","texts":"Enter text here"}]}
    */

    let webpage = await apiRequest("GET", "/webpages/" + id);
    let articles = webpage["articles"];
    for (let article of articles) {
        addSection(article);
    }


    // Patch data
    console.log("it is working")
    let save = document.querySelector("#save-webpage");
    save.addEventListener("click", saveWebpage);


}

setupComWithServer();