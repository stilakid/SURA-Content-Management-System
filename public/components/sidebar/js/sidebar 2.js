class Sidebar {
    // Call it on sidebar when user enters edit mode first.
    // Subsequently, call it on individual li element when adding new li to the sidebar.
    static enterSidebarEditMode(parent_container, data_model) {
        console.log("parent_container", parent_container);
        let heading = parent_container.querySelector('.sidebar-title');
        if (heading) {
            heading.setAttribute("contenteditable", "true");
            heading.addEventListener("input", () => {
                data_model.webpage.sidebar_title = heading.textContent;
            });
        }


        let ul = parent_container.querySelector('.tertiary-navbar ul');
        if (ul) {
            let li = Util.tag('li', {}, "");
            new AddNavLinkButton(data_model).install(li);
            ul.append(li);
        }

        let divs = parent_container.querySelectorAll(".button-navlink");
        for (let i = 0; i < divs.length; i++) {
            new DeleteNavLinkButton(data_model, i).install(divs[i]);
        }

        // TODO: Add edit link button

        // TODO: Add up and down button to arrange the links
    }

    constructor() {
        this.parentContainer = null;

        this.tertiaryNavbar = null;
    }

    install(parent_container, tertiary_nav_links, navlink_title) {
        if (!parent_container) {
            throw "Sidebar: You must provide a div to install the sidebar into.";
        }
        this.parentContainer = parent_container;

        let navbar = this.render(tertiary_nav_links, navlink_title);
        this.addToDOM(navbar, parent_container);
    }


    render(tertiaryNavLinks, navlinkTitle = "Navigation Pane") {
        let content = [];
        for (let navLink of tertiaryNavLinks) {
            content.push(this.renderNavLinks(navLink[0], navLink[1]));
        }
        let ul = Util.tag('ul', {}, content);

        let sidebar_title = Util.tag('h2', {'class': 'sidebar-title'}, navlinkTitle);
        let nav = Util.tag('nav', {'class': 'tertiary-navbar'}, ul);

        let sidebar = Util.tag('div', {'class': 'sticky-sidebar'}, [sidebar_title, nav]);

        let sidebar_section = Util.tag('aside', {'class': 'sidebar'}, sidebar);
        let content_section = Util.tag('section', {'class': 'main-content'}, "");

        let container = Util.tag('div', {'class': 'display-area'}, [sidebar_section, content_section]);
        this.tertiaryNavbar = container;

        return container;
    }


    renderNavLinks(text, link) {
        let li = Util.tag('li', {}, "");
        new NavLinkButton().install(li, text, link);
        return li;
    }


    addToDOM(navbar, parentContainer) {
        parentContainer.append(navbar);
    }


    removeFromDOM() {
        this.tertiaryNavbar.remove();
    }

    _resetInstanceVariables() {
        this.parentContainer = null;

        this.tertiaryNavbar = null;
    }
}