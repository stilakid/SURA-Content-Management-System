let background_image;
let background_video;
let background_color;


let webpage_data = new webpageData();



// const main = async () => {
//     await webpage_data.getDataModel();
//     load_webpage();

//     if (await Util.isAdmin()) {
//         add_admin_features();
//     }
// }


// main();

const run_webpage = async () => {
    let data_model = new webpageData();
    await data_model.getDataModel();
    let navbar_container = document.querySelector("header");
    let sidebar_container = document.querySelector("main");
    let background_container = document.querySelector("main");

    let webpage = new Webpage(data_model)
    webpage.loadWebpage(navbar_container, sidebar_container, sidebar_container, background_container);

    if (await Util.isAdmin()) {
        let dialog_boxes_container = document.querySelector('#temporary');
        let edit_menu_container = document.body;
        webpage.addAdminFeatures(edit_menu_container, dialog_boxes_container);
    }
}

run_webpage();
