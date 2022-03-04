TRANSLATE = 0;
SLIDE_WIDTH = 75;

const slideRight = (event) => {
    
    TRANSLATE += SLIDE_WIDTH;
    let slides = document.querySelectorAll(".slide");
    for (let slide of slides) {
        let argument = "translateX(-"
        argument += TRANSLATE + "vw)"
        slide.style.transform = argument;
    }

    let condition = (TRANSLATE/SLIDE_WIDTH + 1) == parseInt(document.querySelectorAll(".slide").length);

    if (condition) {
        console.log("worked");
        let button = document.querySelector("#button_right");
        button.style.visibility = "hidden";
    }

    condition = (TRANSLATE/SLIDE_WIDTH == 0);

    if (!condition){
        let button = document.querySelector("#button_left");
        button.style.visibility = "visible";
    }

}

const slideLeft = (event) => {
    
    TRANSLATE -= SLIDE_WIDTH;
    let slides = document.querySelectorAll(".slide");
    for (let slide of slides) {
        let argument = "translateX(-"
        argument += TRANSLATE + "vw)"
        slide.style.transform = argument;
    }

    let condition = (TRANSLATE/SLIDE_WIDTH == 0);

    if (condition) {
        console.log("worked");
        let button = document.querySelector("#button_left");
        button.style.visibility = "hidden";
    }

    condition = (TRANSLATE/SLIDE_WIDTH + 1) == parseInt(document.querySelectorAll(".slide").length);

    if (!condition) {
        let button = document.querySelector("#button_right");
        button.style.visibility = "visible";
    }
}

const main = () => {
    let button = document.querySelector("#button_right");
    button.addEventListener("click", slideRight);

    button = document.querySelector("#button_left");
    button.style.visibility = "hidden";
    button.addEventListener("click", slideLeft);
}



main();