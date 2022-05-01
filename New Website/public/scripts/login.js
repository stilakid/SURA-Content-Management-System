import apiRequest from "./api.js";

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

// /* a JWT library that works in the browser */
// import * as jose from "https://cdnjs.cloudflare.com/ajax/libs/jose/4.5.1/index.bundle.min.js";

// /* Make sure to get your own client ID. This one will be deleted soon */
// const CLIENT_ID = "727364268733-vqiv6m0podaak66m0etut6jmef7d9v3d.apps.googleusercontent.com";

// const onLogin = async res => {
//   let keys = await jose.createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));
//   let cred = res.credential;
//   let data = await jose.jwtVerify(cred, keys);
//   console.log(data);

//   let r = await fetch("/api/google", {
//     headers: { Authorization: `Google ${cred}` }
//   });
//   let json = await r.json();
//   console.log(json);
// };

// const login = () => {
//   google.accounts.id.initialize({
//     client_id: CLIENT_ID,
//     callback: onLogin
//   });
//   google.accounts.id.prompt(event => {
//     if (!(event.isNotDisplayed() || event.isSkippedMoment())) return;
//   });
//   google.accounts.id.renderButton(document.querySelector("#google-login"), { theme: "outline" });
// };


login();