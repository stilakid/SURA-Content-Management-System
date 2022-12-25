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
        this.loadTheme();
        await this.loadNavbar(navbar_container);
        this.loadBackground(this.dataModel.webpage, background_container);
        (article_beside_sidebar) ? Article.addDividingBar(sidebar_container, true) : Article.addDividingBar(article_container, true);
        this.loadSidebar(this.dataModel.webpage, sidebar_container);
        article_container = (article_beside_sidebar && sidebar_container.querySelector(".main-content")) ? sidebar_container.querySelector(".main-content") : article_container;
        this.loadWebpageData(this.dataModel.webpage, article_container);
        this.afterWebpageLoad();
    }

    loadTheme() {
        
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

    loadWebpageData(webpage, article_container) {
        if (!article_container) {
            throw "Webpage: You must provide a article container to install the articles into.";
        }
        this.articleContainer = article_container;
    
        let page_title = document.querySelector("#page-title");
        page_title.textContent = webpage["title"];
        if (webpage.title.length === 0) {
            page_title.style.backgroundColor = "transparent";
        }

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
        let background = new Background(this.dataModel);
        background.install(background_container);
        let color_1 = webpage.background.color[0];
        let color_2 = webpage.background.color[1];
        let img_url = webpage.background.image;
        let vid_url = webpage.background.video;
    
        if (webpage.background.image !== "") {
            Background.loadBackgroundImage(background.background, background.vidTag, background.vidSrc, img_url, color_1, color_2);
        }
        else if (webpage.background.video !== "") {
            Background.loadBackgroundVideo(background.background, background.vidTag, background.vidSrc, vid_url, color_1, color_2);
        }
        else {
            Background.loadBackgroundColor(background.background, color_1, color_2, img_url);
        }
    }


    addAdminFeatures(edit_menu_container, dialog_box_container) {
        new EditMenu(this.dataModel).install(edit_menu_container, this.articleContainer, this.sidebarContainer, dialog_box_container);
    }


    // Useful for responsive design + anything that needs components to be in the DOM.
    afterWebpageLoad() {
        this._removePreLoader();

        this._addTransitionEffects();

        

        // *************************
        // Template 13

        // Set height of slide container
        let template_13s = document.querySelectorAll('.article.template-13');
        for (let article of template_13s) {
            let article_id = article.id;
            let index = Util.getArticleIndex(article_id, this.dataModel.webpage.articles);
            Article.afterLoadingTemplateThirteen(article, this.dataModel.webpage.articles[index].images);
        }

        // Adjust Slide Height
        window.addEventListener('resize', () => {
        });
    }

    _removePreLoader() {
        const loader = document.querySelector('.loader');
        loader.remove();
    }

    _addTransitionEffects() {
        // Toggle Navbar design
        const navbar = document.querySelector('.primary-navbar-container');
        const titlebar = document.querySelector('.title-bar');

        const empty_div = document.querySelector('#empty-space');

        const empty_div_observer_options = {
            rootMargin: "-70px 0px 0px 0px"
        };
        const empty_div_observer = new IntersectionObserver((entries, empty_div_observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navbar.classList.add("nav-not-scrolled");
                    titlebar.classList.add("nav-not-scrolled");
                } else {
                    navbar.classList.remove("nav-not-scrolled");
                    titlebar.classList.remove("nav-not-scrolled");
                }
            });
        }, empty_div_observer_options);
        empty_div_observer.observe(empty_div);


        // Fade in articles
        const article_children = document.querySelectorAll('.article > *');
        for (let article_child of article_children) {
            article_child.style.opacity = 0;
        }

        const articles_observer_options = {
            // threshold: 0.25,
            rootMargin: "0px 0px -200px 0px"
        }

        const articles_observer = new IntersectionObserver((entries, articles_observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("fade-up");
                    articles_observer.unobserve(entry.target);
                }
            });
        }, articles_observer_options);

        for (let article_child of article_children) {
            articles_observer.observe(article_child);
        }

        // Fade in Sidebar
        const sidebar = document.querySelector(".sticky-sidebar");
        if (sidebar) {
            sidebar.style.opacity = 0;
            const sidebar_observer_options = {
                rootMargin: "0px 0px -200px 0px"
            }
    
            const sidebar_observer = new IntersectionObserver((entries, sidebar_observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("fade-right");
                        articles_observer.unobserve(entry.target);
                    }
                });
            }, sidebar_observer_options);
    
            sidebar_observer.observe(sidebar);
        }
    }

}
