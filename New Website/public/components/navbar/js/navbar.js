class Navbar {
    constructor() {
        this.parentContainer = null;

        this.primaryNavbar = null;
        this.secondaryNavbar = null;
        this.primaryNavPanel = null;
        this.navbarContainer = null;

        this._onLogOut = this._onLogOut.bind(this);
    }
    
    /**
     * 
     * @param {*} parentContainer 
     * @param {*} primaryNavLinks This is an array containing array that have two entries. The first entry is the name of the link and the second entry is the url.
     * @param {*} secondaryNavLinks Same as above.
     */
    async install(parentContainer, primaryNavLinks, secondaryNavLinks) {
        if (!parentContainer) {
            throw "Navbar: You must provide a div to install the navbar into.";
        }
        this.parentContainer = parentContainer;

        let navbar = await this.render(primaryNavLinks, secondaryNavLinks);
        this.addToDOM(navbar, parentContainer);
    }

    
    async render(primaryNavLinks, secondaryNavLinks) {
        let navbars = [];
        navbars.push(await this.renderPrimaryNavbar(primaryNavLinks));
        navbars.push(await this.renderNavPanel(primaryNavLinks));
        navbars.push(this.renderTitleBar());
        if (secondaryNavLinks) {
            navbars.push(this.renderSecondaryNavbar(secondaryNavLinks));
        }

        let container = Util.tag('div', {'class': 'navbar-container'}, navbars);
        this.navbarContainer = container;

        return container;
    }

    async renderPrimaryNavbar(primaryNavLinks) {
        let content = [];
        for (let navLink of primaryNavLinks) {
            content.push(this.renderNavLinks(navLink[0], navLink[1]));
        }
        if (!await Util.isAdmin()) {
            content.push(this.renderNavLinks("Login", "/login.html"));
        } else {
            let navlink = this.renderNavLinks("Logout");
            navlink.addEventListener('click', this._onLogOut);
            content.push(navlink);
        }

        let ul = Util.tag('ul', {'id': 'primary-nav'}, content);
        let navlinks = Util.tag('nav', {'id': 'primary-navbar', 'role': 'navigation'}, [ul]);

        let homepageImg = Util.tag('img', {'id': 'sura-logo-home', 'src': Util.suraLogo}, "");
        let homepageTxt = Util.tag('p', {}, "SURA");
        let homepageLink = Util.tag('a', {"id": "SURA", "href": "/", "title": "Home", "rel": "home"}, [homepageImg, homepageTxt]);
        // We need this empty div to not make the SURA homelink be clickable across half of the header.
        let emptyDiv = Util.tag('div', {}, "");
        let mainLink = Util.tag('div', {'id': 'SURA-div'}, [homepageLink, emptyDiv]);

        let navbar = Util.tag('div', {'class': 'primary-navbar-container'}, [mainLink, navlinks]);
        this.primaryNavbar = navbar;

        return navbar;
    }

    renderSecondaryNavbar(secondaryNavLinks) {
        let content = [];
        for (let navLink of secondaryNavLinks) {
            content.push(this.renderNavLinks(navLink[0], navLink[1]));
        }

        let ul = Util.tag('ul', {'id': 'secondary-nav'}, content);
        let navlinks = Util.tag('nav', {'id': 'secondary-navbar', 'role': 'navigation'}, [ul]);

        let navbar = Util.tag('div', {'class': 'secondary-navbar-container'}, [navlinks]);
        this.secondaryNavbar = navbar;

        return navbar;
    }

    async renderNavPanel(primaryNavLinks) {
        let content = [];
        for (let navLink of primaryNavLinks) {
            content.push(this.renderNavLinks(navLink[0], navLink[1]));
        }
        if (!await Util.isAdmin()) {
            content.push(this.renderNavLinks("Login", "/login.html"));
        } else {
            let navlink = this.renderNavLinks("Logout");
            navlink.addEventListener('click', this._onLogOut);
            content.push(navlink);
        }

        let ul = Util.tag('ul', {'id': 'primary-nav-panel-list'}, content);
        let navlinks = Util.tag('nav', {'id': 'primary-nav-panel', 'role': 'navigation'}, [ul]);

        let navPanel = Util.tag('div', {'class': 'primary-nav-panel-sidebar'}, [navlinks]);
        this.primaryNavPanel = navPanel;

        return navPanel;
    }

    renderTitleBar() {
        let homepageImg = Util.tag('img', {'id': 'sura-logo-home-alternate', 'src': Util.suraLogo}, "");
        let homepageTxt = Util.tag('p', {}, "SURA");
        let homepageLink = Util.tag('a', {"id": "SURA-alternate", "href": "/", "title": "Home", "rel": "home"}, [homepageImg, homepageTxt]);
        // We need this empty div to not make the SURA homelink be clickable across half of the header.
        let mainLink = Util.tag('div', {'id': 'SURA-div-alternate'}, [homepageLink]);
        let titlebar = Util.tag('div', {'class': "title-bar"}, mainLink);
        new NavPanelButton().install(titlebar, this.primaryNavPanel);
        return titlebar;
    }

    renderNavLinks(text, link) {
        let a;
        if (link) {
            a = Util.tag('a', {'href': link}, text);
        } else {
            a = Util.tag('a', {}, text);
            a.style.cursor = "pointer";
        }
        let li = Util.tag('li', {'class': 'leaf'}, a);
        return li;
    }

    addToDOM(navbar, parentContainer) {
        parentContainer.append(navbar);
    }

    removeFromDOM() {
        this.navbarContainer.remove();
    }

    _resetInstanceVariables() {
        this.parentContainer = null;

        this.primaryNavbar = null;
        this.secondaryNavbar = null;
    }

    _onLogOut = () => {
        sessionStorage.removeItem("API_KEY");
        // Redirects the user to the homepage after successfully logging out.
        window.location.href="/";
    }
}



