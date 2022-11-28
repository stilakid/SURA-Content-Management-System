// This data model is designed to 90% of the time reflect the live state of the data representation on
// the website.
// The 10% is reserved for making the process more efficient. So, you will find some arrays will reflect
// the true state of the data representation only after hitting the save button.
// Motivation for the 10%: True live state update requires expensive tasks such as rewiring all the event listeners
// inside all articles for just one simple action such as adding a new article at the top. Rewiring everything is redundant.


/**
 * 
 *  this.webpage = {
 *      "id": "default-page.html",
 *      "title": "Page Title",
 *      "sidebar_title": "Navigation Pane",
 *      "sidebar": [
 *          ["This Webpage", "http://localhost:1930/default-page.html"],
 *          ["Article2", "#article1657502105488"]
 *      ],
 *      "background": {
 *          "image": "",
 *          "video": "/videos/default-page/SRC_2015.mp4",
 *          "color": [
 *              "#B73A6C9E",
 *              "#FFC10785"
 *          ]
 *      },
 *      "articles": [
 *          {
 *              "article_id": "article1657502107033",
 *              "template": "template-2",
 *              "heading": "Heading Goes Here",
 *              "subheadings": ["Sub 1", "Sub 2"],
 *              "texts": [
 *                  ["Enter text here"],
 *                  ["paragraph1", "", "paragraph2"]
 *              ],
 *              "links": [
 *                  [{text: "link1", url: "/"}, {text: "link2", url: "/"}],
 *                  [{text: "section2", url:#}]
 *              ],
 *              "images": [
 *                  "/images/default-page/Albert.jpg",
 *                  "/images/title.png"
 *              ],
 *              "videos": []
 *          },
 *          {
 *              "article_id": "article1657502105488",
 *              "template": "template-1",
 *              "heading": "Empty Section",
 *              "subheadings": [],
 *              "texts": [
 *                  ["Enter text here"]
 *              ],
 *              "links": [
 *                  []
 *              ],
 *              "images": [],
 *              "videos": []
 *          }
 *      ]
 *  }
 * 
 * 
 * 
 */
class WebpageData {

    static getWebpageName() {
        let id = location.href.split("/").slice(-1)[0];
        let webpage_name = id.split("#").slice(0, 1)[0];
        return webpage_name;
    }

    constructor() {
        this.webpage = null;
        this.primaryNavbar = null;
        this.secodaryNavbar = null;
        this.webpageName = null;
        this.webpageNameNoExtension = null;
        this.listOfWebpages = null;
        this.listOfWebpageUrls = null;
        this.articleArrangement = null;
        this.imageNames = [];
        this.videoNames = [];
    }

    // Fetches data from the server.
    async getDataModel() {
        let id = location.href.split("/").slice(-1)[0];
        if (id === "") {
            id = "index.html"
            location.href = location.href + id;
        }
        this.getWebpageName();
        this.webpage = await apiRequest("GET", "/webpages/" + id);
        this.getArticleArrangement();
        this.getImageNames();
        await this.getNavbarDataModel();
        console.log("data model", this);

        for (let i = 0; i < this.webpage.articles.length; i++) {
            // Clear the remains of deleted images.
            // console.log("images?", this.webpage.articles[i].images)
            // for (let j = 0; j < this.webpage.articles[i].images.length; j++) {
            //     console.log("loop", this.webpage.articles[i].images[j])
            //     if (this.webpage.articles[i].images[j] == null) {
            //         this.webpage.articles[i].images.splice(j, 1);
            //         j--;
            //     }
            // }
        }
        console.log("data model", this);
    }

    // Fetches data from the server that requires admin privileges.
    async getProtectedDataModel() {
        await this.getListOfWebpages();
        await this.getListOfWebpageUrls();
        console.log("data model", this);
    }

    getArticleArrangement() {
        this.articleArrangement = [];
        for (let article of this.webpage.articles) {
            this.articleArrangement.push(article.article_id);
        }
        return this.articleArrangement;
    }

    getImageNames() {        
        this.imageNames.push(this.webpage.background.image);
        for (let article of this.webpage.articles) {
            if (article.background.image) {
                this.imageNames.push(article.background.image);
            }
            for (let image_data of article.images) {
                let url = image_data.url;
                if (!url) { continue }
                let filename = url.split("/").slice(-1)[0];
                this.imageNames.push(filename);
            }
        }
    }

    getVideoNames() {
        this.videoNames.push(this.webpage.background.video);
    }

    async getNavbarDataModel() {
        this.primaryNavbar = await apiRequest("GET", "/navbars");
        return this.primaryNavbar;
    }


    getWebpageName() {
        let id = location.href.split("/").slice(-1)[0];
        this.webpageName = id.split("#").slice(0, 1)[0];
        this.webpageNameNoExtension = this.webpageName.split(".").slice(0, 1)[0];
    }

    async getListOfWebpages() {
        this.listOfWebpages = await apiRequest("GET", "/protected/webpages");
        return this.listOfWebpages;
    }

    async getListOfWebpageUrls() {
        this.listOfWebpageUrls = await apiRequest("GET", "/protected/urls");
        return this.listOfWebpages;
    }


    // For making new pages.
    makeNewDataModel(webpage_name, ) {
        this.webpage = {
            id: webpage_name,
            title: 'Page Title',
            sidebar: [],
            sidebar_title: 'Navigation Pane',
            background: { image: '', video: '', color: [ 'transparent', 'transparent' ] },
            theme: 'original',
            articles: []
        };
        return this.webpage;
    }

    // Takes in a datamodel send by the server and makes a new one with the same info.
    // This is to minimize errors in the data.
    readDataModel() {
        
    }

    /**
     * First, checks if the current filename of the image is not taken.
     * Then, uploads the image to the server.
     * 
     * @param {*} input 
     * @returns 
     */
    async uploadImage(file) {
        let imageData = new FormData();
        imageData.append("webpage", this.webpageNameNoExtension);
        imageData.append("media", "image");

        file = this._resolveFilenameConflicts(file, this.imageNames);
        imageData.append("image", file);
        
        // Post new image to server and get filename
        // The server checks if an old image that was deleted in this session and a new image added in this session has the same filename.
        let url = "/protected/images";
        let updated_filename = await apiRequest("POST", url, imageData, "formData");

        // Adds updated filename to the array imageNames to keep track of new names.
        return updated_filename;
    }

    async uploadVideo(file) {
        // TODO
        let videoData = new FormData();
        videoData.append("webpage", this.webpageNameNoExtension);
        videoData.append("media", "video");

        file = this._resolveFilenameConflicts(file, this.videoNames);
        videoData.append("video", file);
        
        // Post new image to server and get filename
        // The server checks if an old image that was deleted in this session and a new image added in this session has the same filename.
        let url = "/protected/videos";
        let updated_filename = await apiRequest("POST", url, videoData, "formData");

        // Adds updated filename to the array imageNames to keep track of new names.
        return updated_filename;
    }

    /**
     * TODO: In an array containing links/articles, if one of the entry is an empty array, it means it was deleted.
     * E.g. links = [[{text:"Desktop", url:"/Desktop"}, {}], [{text:"Home", url:"/"}]]
     * 
     * This applies to:
     *  articles: empty object.
     *  links: empty array.
     *  images: empty string.
     * 
     */
     async saveWebpageDataModel() {
        // Clear the remains of deleted sidebar data.
        for (let i = 0; i < this.webpage.sidebar.length; i++) {
            if (this.webpage.sidebar[i] == null) {
                this.webpage.sidebar.splice(i, 1);
                i--;
            }
        }

        // Clear the remains of deleted article data.
        for (let i = 0; i < this.webpage.articles.length; i++) {
            // Delete article data for deleted articles.
            if (this.webpage.articles[i] == null) {
                this.webpage.articles.splice(i, 1);
                i--;
            }
        }

        // Arrange article data based on the arrangement specified by the user.
        for (let i = 0; i < this.articleArrangement.length; i++) {
            for (let j = i; j < this.webpage.articles.length; j++) {
                if (this.articleArrangement[i] === this.webpage.articles[j].article_id) {
                    let article = this.webpage.articles.splice(j, 1)[0];
                    this.webpage.articles.splice(i, 0, article);
                }
            }
        }

        // Clear the remains of deleted values inside each article.
        for (let i = 0; i < this.webpage.articles.length; i++) {
            // Clear the remains of deleted images.
            for (let j = 0; j < this.webpage.articles[i].images.length; j++) {
                if (this.webpage.articles[i].images[j] == null) {
                    this.webpage.articles[i].images.splice(j, 1);
                    j--;
                }
            }


            // Clear the remains of deleted link sections and links
            for (let j = 0; j < this.webpage.articles[i].links.length; j++) {
                if (this.webpage.articles[i].links[j] == null) {
                    this.webpage.articles[i].links.splice(j, 1);
                    j--;
                    continue;
                }

                console.log("link", this.webpage.articles[i].links);
                for (let k = 0; k < this.webpage.articles[i].links[j].length; k++) {
                    if (this.webpage.articles[i].links[j][k] == null) {
                        this.webpage.articles[i].links[j].splice(k, 1);
                        k--;
                    }
                }
            }

            // Clear the remains of deleted text sections
            for (let j = 0; j < this.webpage.articles[i].texts.length; j++) {
                if (this.webpage.articles[i].texts[j] == null) {
                    this.webpage.articles[i].texts.splice(j, 1);
                    j--;
                }
            }


            // Clear the remains of deleted subheadings
            for (let j = 0; j < this.webpage.articles[i].subheadings.length; j++) {
                if (this.webpage.articles[i].subheadings[j] == null) {
                    this.webpage.articles[i].subheadings.splice(j, 1);
                    j--;
                }
            }
        }

                

        let res = await apiRequest("PATCH", `/protected/webpages/${this.webpageName}`, this.webpage);
        console.log("new webpage data", res);
    }
    // async saveWebpageDataModel() {
    //     // Clear the remains of deleted sidebar data.
    //     for (let i = 0; i < this.webpage.sidebar.length; i++) {
    //         if (this.webpage.sidebar[i].length === 0) {
    //             this.webpage.sidebar.splice(i, 1);
    //             i--;
    //         }
    //     }

    //     // Clear the remains of deleted article data.
    //     for (let i = 0; i < this.webpage.articles.length; i++) {
    //         // Delete article data for deleted articles.
    //         if (Object.keys(this.webpage.articles[i]).length === 0) {
    //             this.webpage.articles.splice(i, 1);
    //             i--;
    //         }
    //     }

    //     // Arrange article data based on the arrangement specified by the user.
    //     for (let i = 0; i < this.articleArrangement.length; i++) {
    //         for (let j = i; j < this.webpage.articles.length; j++) {
    //             if (this.articleArrangement[i] === this.webpage.articles[j].article_id) {
    //                 let article = this.webpage.articles.splice(j, 1)[0];
    //                 this.webpage.articles.splice(i, 0, article);
    //             }
    //         }
    //     }

    //     // Clear the remains of deleted values inside each article.
    //     for (let i = 0; i < this.webpage.articles.length; i++) {
    //         // Clear the remains of deleted images.
    //         for (let j = 0; j < this.webpage.articles[i].images; j++) {
    //             if (this.webpage.articles[i].images[j].length === 0) {
    //                 this.webpage.articles[i].images.splice(j, 1);
    //                 j--;
    //             }
    //         }

    //         // Clear the remains of deleted links.
    //         for (let j = 0; j < this.webpage.articles[i].links.length; j++) {
    //             for (let k = 0; k < this.webpage.articles[i].links[j].length; k++) {
    //                 if (Object.keys(this.webpage.articles[i].links[j][k]).length === 0) {
    //                     this.webpage.articles[i].links[j].splice(k, 1);
    //                     k--;
    //                 }
    //             }
    //         }
    //     }
    //     let res = await apiRequest("PATCH", `/protected/webpages/${this.webpageName}`, this.webpage);
    //     console.log("new webpage data", res);
    // }

    async saveNavbarDataModel() {
        let res = await apiRequest("PATCH", `/protected/navbars/${this.webpage_name}`, navbar_update);
        console.log(res);
    }


    _resolveFilenameConflicts(file, names_taken) {
        let filename = file.name;

        // If there is no conflict
        if (!names_taken.includes(filename)) {
            // Add file to image form
            names_taken.push(filename);
            return file;
        } else {  // If there is conflict
            // Generate new unique filename
            let parts_of_filename = file.name.split(".");
            let primary_filename = "";
            for (let i = 0; i < parts_of_filename.length - 1; i++) {
                primary_filename += parts_of_filename[i] + ".";
            }
            let file_extension = parts_of_filename.slice(-1)[0];
            filename = primary_filename + file_extension;
            let i = 1;
            while (names_taken.includes(filename)) {
                filename = `${primary_filename}${i}.${file_extension}`;
                i++;
            }

            // Make new file with new filename
            let new_file = new File([file], filename, {
                type: file.type,
                lastModified: file.lastModified
            });

            // Add file to image form
            names_taken.push(filename);
            return new_file;
        }
    }

}