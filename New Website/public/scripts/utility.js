let Util = {};

Util.defaultMemberPhoto = "/images/default-member-photo.png";

Util.templateImages = {
    'template-1': "/images/Template_1.png",
    'template-2': "/images/Template_2.png",
    'template-3': "/images/Template_3.png",
    'template-4': "/images/Template_4.png",
    'template-5': "/images/Template_5.png",
    'template-6': "/images/Template_6.png",
    'template-7': "/images/Template_7.png",
    'template-8': "/images/Template_8.png",
    'template-9': "/images/Template_9.png",
    'template-10': "/images/Template_10.png",
    'template-11': "/images/Template_11.png",
    'template-12': "/images/Template_12.png",
    'template-13': "/images/Template_13.png",
}

Util.suraLogo = "/images/sura_logo_white.png";
Util.suraLogoTransparent ="/images/sura_logo.png";
Util.albert = "/images/Albert.jpg";

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

Util.encodeUriAll = (url) => {
    if (url.slice(0, 5) === "data:") { // if it is a data uri, we do not want to encode it as it is alrady in the correct form. Encoding it causes errors.
        return url;
    }
    
    // For some reason, if url starts with '/', the encoded value of '/' is not interpreted correctly. This is evident when you add background image for html_not_core files.
    if (url[0] === '/') {
        url = url.slice(1);
        return '/' + url.replace(/[^A-Za-z0-9]/g, c =>
            `%${c.charCodeAt(0).toString(16).toUpperCase()}`
        );
    }

    return url.replace(/[^A-Za-z0-9]/g, c =>
        `%${c.charCodeAt(0).toString(16).toUpperCase()}`
    );
}

Util.createImageData = (url, obj_fit, width, height) => {
    return {'url': url, 'obj_fit': obj_fit, 'width': width, 'height': height};
}

Util.getDimensions = (elem) => {
    let rect = elem.getBoundingClientRect();

    return [rect.width, rect.height];
}

// name_and_value is an array of arrays
Util.createRadioButtons = (name_and_value, caption) => {
    let options = [];
    let group_id = Util.generateUniqueID();

    if (caption) {
        options.push(Util.tag('legend', {}, caption));
    }

    for (let elem of name_and_value) {
        let id = Util.generateUniqueID();
        let input = Util.tag('input', {'type': 'radio', 'id': id, 'value': elem[1], 'name': group_id}, "");
        let label = Util.tag('label', {'for': id}, elem[0]);
        options.push(input, label);
    }

    let field_set = Util.tag('fieldset', {}, options);
    return field_set;
}

Util.getArticleIndex = (article_id, articles_data) => {
    for (let i = 0; i < articles_data.length; i++) {
        if (articles_data[i] && articles_data[i].article_id === article_id) {
            return i;
        }
    }
}

Util.findEquivalentHeight = (elem, ref_width, ref_height) => {
    let [width] = Util.getDimensions(elem);
    return (width * ref_height) / ref_width;
}

Util.makeQueryValid = (query) => {
    let new_query = "";
    for (let ch of query) {
        if (ch === '.') {
            new_query += "\\";
        }
        new_query += ch;
    }
    return new_query;
}