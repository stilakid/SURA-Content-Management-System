// import apiRequest from "./api.js";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require('fs');
const path = require('path');


// import {fs} from 'fs';


// Test for deleting files.

let button = document.querySelector("#edit-page");
let arr = ["IMG20200304110959.1.1.jpg", "IMG20200304110959.1.2.jpg", "IMG20200304110959.1.jpg"]

let file_path = `public/images/${webpage_name}/`;
for (let elem of arr) {
    file_path = file_path + elem;
    fs.unlink(file_path, (err) => {
        if (err) {
          console.log("Error Found:", err);
          throw err;
        }
      });
}