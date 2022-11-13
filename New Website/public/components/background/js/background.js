class Background {
    static loadBackgroundImage(background, bg_vid_tag, bg_vid_src, img_url, color_1, color_2) {
        background.style.backgroundImage = `linear-gradient(${color_1}, ${color_2}), url(${encodeURI(img_url)})`;
        bg_vid_src.removeAttribute("src");
        bg_vid_tag.load();
    }

    static loadBackgroundVideo(background, bg_vid_tag, bg_vid_src, vid_url, color_1, color_2) {
        background.style.backgroundImage = `linear-gradient(${color_1}, ${color_2})`;
        bg_vid_src.src = encodeURI(vid_url);
        bg_vid_tag.load();
        bg_vid_tag.muted = true;
        bg_vid_tag.play();
    }

    static loadBackgroundColor(background, color_1, color_2, image) {
        if (image !== "") {
            background.style.backgroundImage = `linear-gradient(${color_1}, ${color_2}), url(${encodeURI(image)})`;
        }
        // if bg video is present, it is handled by video tag. So, the bg-image property is the same as the case with only colors.
        else {
            background.style.backgroundImage = `linear-gradient(${color_1}, ${color_2})`;
        }
    }
    
    constructor(data_model) {
        this.parentContainer = null;
        this.dataModel = data_model;
        this.background = null;
        this.emptySpace = null;
        this.vidSrc = null;
        this.vidTag = null;
    }

    install(parent_container, generic = false) {
        if (!parent_container) {
            throw "Background Editor: You must provide a container tag to install the Background into.";
        }
        let background = this.render(generic);
        this.addToDOM(background, parent_container);
    }

    render(generic) {
        let page_title = Util.tag('h1', {'id': "page-title"}, "");
        if (generic) {
            // Generic Style
        }

        let source = Util.tag('source', {'type': "video/mp4"}, "");
        let video = Util.tag('video', {'autoplay': "", 'muted': "", 'loop': "", 'id': "page-background-video"}, source);
        this.vidSrc = source;
        this.vidTag = video;

        let bg_container = Util.tag('div', {'id': "background-container"}, [page_title, video]);
        let empty_space = Util.tag('div', {'id': "empty-space"}, "");
        this.background = bg_container;
        this.emptySpace =  empty_space;

        return [bg_container, empty_space];
    }

    addToDOM(background, parentContainer) {
        if (background instanceof Array) {
            for (let elem of background) {
                parentContainer.append(elem);
            }
        } else {
            parentContainer.append(background);
        }
    }
}