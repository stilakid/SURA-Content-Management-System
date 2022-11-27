const run_webpage = async () => {
    let navbar_container = document.querySelector("header");
    let sidebar_container = document.querySelector("main");
    let background_container = document.querySelector("main");

    let data_model = new WebpageData();
    let webpage = new Webpage(data_model)

    if (WebpageData.getWebpageName() === "login.html") {
        await data_model.getNavbarDataModel();
        await webpage.loadNavbar(navbar_container);
        if (await Util.isAdmin()) {
            console.log("You are already logged in!!!")
        }
    } else {
        await data_model.getDataModel();
        await webpage.loadWebpage(navbar_container, sidebar_container, sidebar_container, background_container);
        if (await Util.isAdmin()) {
            let dialog_boxes_container = document.querySelector('#temporary');
            let edit_menu_container = document.body;
            webpage.addAdminFeatures(edit_menu_container, dialog_boxes_container);
        }
    }


}

run_webpage();
