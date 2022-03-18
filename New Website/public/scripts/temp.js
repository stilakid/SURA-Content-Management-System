// For creating new page mechanism.

import apiRequest from "./api.js";


const showMakeNewPageDialog = () => {
    let dialog = document.querySelector("#make-new-page-dialog");
    dialog.style.visibility = "visible";
}

const hideMakeNewPageDialog = () => {
    let dialog = document.querySelector("#make-new-page-dialog");
    dialog.style.visibility = "hidden";
    let input = dialog.querySelector("input");
    input.value = "";
}

async function makeNewPage () {
    // Step one: Make copy of default page
    // Register this new webpage in MongoDB webpages collection.
    let dialog = document.querySelector("#make-new-page-dialog");
    let input = dialog.querySelector("input");
    let webpage = await apiRequest("POST", "/webpages", {"id": input.value});
    console.log(webpage);
    return webpage;

    // Step two: Add link to that new page in every other page. (Load data from database)


    // Step three: Redirect to that newly created page

}


const temp = () => {
    // Make "Make New Page" dialog box work
    let make_new_page = document.querySelector("#make-new-page-dialog .create-new-page");
    let do_not_make_new_page = document.querySelector("#make-new-page-dialog .cancel");
    make_new_page.addEventListener("click", makeNewPage);
    do_not_make_new_page.addEventListener("click", hideMakeNewPageDialog);

    // Make "Make New page" dialog box accessible
    let button = document.querySelector("#make-new-page");
    button.addEventListener("click", showMakeNewPageDialog);
}





temp();