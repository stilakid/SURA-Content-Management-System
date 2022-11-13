let Util = {};

Util.defaultMemberPhoto = "/images/default-member-photo.png";

Util.addImgPic = "/images/add-image.svg"

Util.suraLogo = "/images/sura_logo_white.png"

Util.uniqueIDs = [];

Util.generateUniqueID = () => {
    while(true) {
        let id =  performance.now();
        if (!Util.uniqueIDs.includes(id)) {
            Util.uniqueIDs.push(id);
            return "unique-id-" + String(id);
        }
    }
}


// Checks if user is admin
Util.isAdmin = async () => {
    let API_KEY = sessionStorage.getItem('API_KEY');

    if (API_KEY !== null) {
        let res = await apiRequest("GET", "/protected/isAdmin");
        if (res.isAdmin === true) {
            return true;
        }
    } else {
        return false;
    }
}


Util.reloadWebpage = () => {
    window.location.href=document.location.href.match(/(^[^#]*)/)[0];
}


// Create a tag with the specified attributes and contents.
Util.tag = (name, attrs, contents = "", quote = true) => {
    const element = document.createElement(name);
    for (const attr in attrs) {
        if (attrs.hasOwnProperty(attr)) {
            element.setAttribute(attr, attrs[attr]);
        }
    }
    // If contents is a single string or HTMLElement, make it an array of one
    // element; this guarantees that contents is an array below.
    if (!(contents instanceof Array)) {
        contents = [contents];
    }

    contents.forEach(piece => {
        if (piece instanceof HTMLElement) {
            element.appendChild(piece);
        } else {
            // must create a text node for a raw string
            if (quote) {
                element.appendChild(document.createTextNode(piece));
            } else {
                element.innerHTML += piece;
            }
        }
    });


    return element;
}



Util.generateID = (article) => {
    article.id = `article${Date.now()}`;
}

