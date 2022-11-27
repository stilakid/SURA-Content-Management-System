const CLIENT_ID = "727364268733-vqiv6m0podaak66m0etut6jmef7d9v3d.apps.googleusercontent.com";
let API_KEY = null;

const onLogin = async res => {
    let cred = res.credential;
    let data = await apiRequest("POST", "/login", { idToken: cred });
    API_KEY = data.apiKey;

    // Saves the API_KEY such that it can be accessed across multiple webpages.
    sessionStorage.setItem('API_KEY', API_KEY);

    // Redirects the user to the homepage after successfully logging in.
    window.location.href = "/";
}

const testing = async () => {
    API_KEY = sessionStorage.getItem('API_KEY');
    console.log(API_KEY);
    let test = await apiRequest("GET", "/protected/test");
    console.log(test);
}

const login = () => {
    google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: onLogin
    });
    google.accounts.id.renderButton(
        document.querySelector("#google-login"), 
        { type: "standard", theme: "outliine" , size: "large", shape: "circle" }
    );

    let test_button = document.querySelector("#testing");
    test_button.addEventListener("click", testing);
}


login();















let webpage_data = new WebpageData();


const main = async () => {
    await webpage_data.getNavbarDataModel();
    await load_navbar();

    if (await Util.isAdmin()) {
        // Tell you're already logged in. Ask if you want to log out.
    }
}

// main();