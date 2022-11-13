class Webpage {
    constructor(data_model) {
        this.dataModel = data_model;
        this.navbarContainer = null;
        this.sidebarContainer = null;
        this.articleContainer = null;
    }

    /**
     * This is the parent method of this class.
     * 
     * Use this to load standard webpages with a navbar, some articles, and optionally a sidebar.
     * For further customization, such as multiple sidebars and multiple article containers, use 
     * other methods in this class directly.
     * 
     * @param {*} navbar_container 
     * @param {*} sidebar_container 
     * @param {*} article_container 
     * @param {*} article_beside_sidebar 
     */
    async loadWebpage(navbar_container, article_container, sidebar_container, background_container, article_beside_sidebar = true) {
        await this.loadNavbar(navbar_container);
        this.loadBackground(this.dataModel.webpage, background_container);
        this.loadSidebar(this.dataModel.webpage, sidebar_container);
        article_container = (article_beside_sidebar && sidebar_container.querySelector(".main-content")) ? sidebar_container.querySelector(".main-content") : article_container;
        this.loadWebpageData(this.dataModel.webpage, article_container, background_container);
    }



    async loadNavbar(navbar_container) {
        if (!navbar_container) {
            throw "Webpage: You must provide a navbar container to install the navbar into.";
        }
        this.navbarContainer = navbar_container;
        let primary_nav_bar = this.dataModel.primaryNavbar;
        // Load Secondary Nav Bar
        // let secondary_nav_bar = await apiRequest();

        let navbar = new Navbar();
        await navbar.install(navbar_container, primary_nav_bar);
    }

    loadSidebar(webpage, sidebar_container) {
        if (!sidebar_container) {
            throw "Webpage: You must provide a sidebar container to install the sidebar into.";
        }
        this.sidebarContainer = sidebar_container;
        if (webpage["sidebar"].length > 0) {
            let sidebar = new Sidebar();
            sidebar.install(sidebar_container, webpage["sidebar"], webpage["sidebar_title"]);
        }
    }

    loadWebpageData(webpage, article_container, background_container) {
        if (!article_container) {
            throw "Webpage: You must provide a article container to install the articles into.";
        }
        this.articleContainer = article_container;
    
        let page_title = document.querySelector("#page-title");
        page_title.textContent = webpage["title"];

        let articles = webpage["articles"];
        for (let article of articles) {
            let section = new Article(this.dataModel);
            section.install(article_container, article);
        }
    }

    loadBackground(webpage, background_container) {
        if (!background_container) {
            throw "Webpage: You must provide a background container to install the background into.";
        }
        let background = new Background(this.dataModel)
        background.install(background_container);
        let body = document.querySelector("body");
        let color_1 = webpage.background.color[0];
        let color_2 = webpage.background.color[1];
        let img_url = webpage.background.image;
        let vid_url = webpage.background.video;
    
        if (webpage.background.image !== "") {
            Background.loadBackgroundImage(body, background.vidTag, background.vidSrc, img_url, color_1, color_2);
        }
        else if (webpage.background.video !== "") {
            Background.loadBackgroundVideo(body, background.vidTag, background.vidSrc, vid_url, color_1, color_2);
        }
        else {
            Background.loadBackgroundColor(body, color_1, color_2, img_url);
        }
    }


    addAdminFeatures(edit_menu_container, dialog_box_container) {
        new EditMenu(this.dataModel).install(edit_menu_container, this.articleContainer, this.sidebarContainer, dialog_box_container);
    }

}