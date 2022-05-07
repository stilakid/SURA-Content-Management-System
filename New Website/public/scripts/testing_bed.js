import apiRequest from "./api.js";

// Test for saving images to server...
let input = document.querySelector("#image");
// let input = document.createElement("input");
// input.setAttribute("type", "file");
// input.setAttribute("accept", "image/*");
let button = document.querySelector("#edit-page");
button.addEventListener("click", () => {
    input.click();
});
input.addEventListener("change", async (event) => {
    let url = "/protected/images";
    let form = document.querySelector("#form");
    let formData = new FormData(form);
    // formData.append("filename", "Sorry.jpg");
    // formData.append("webpage", "default-page.html");
    // formData.append("image", input.files[0]);
    // for (let entry of formData.entries()) {
    //     console.log(entry);
    // }
    // console.log(formData);
    let filename = await apiRequest("POST", url, formData, "formData");
    console.log(filename);
});