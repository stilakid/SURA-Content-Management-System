// WELCOME TO THE BACKEND!!! MUUAAAAHAHAHAHAHAAAAAA T^T

// Import the filesystem module
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require('fs');
const path = require('path');


// Standard Imports
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { MongoClient } from "mongodb";


// For Google Authentication
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
const CLIENT_ID = "727364268733-vqiv6m0podaak66m0etut6jmef7d9v3d.apps.googleusercontent.com";
const JWT_SECRET = "+iG1Zhkv2Y7QDdu7qV7R8XI6pdGSwP04WPb6NVmOYKM=";


// For making deep copy.
const v8 = require('v8');
const structuredClone = obj => {
  return v8.deserialize(v8.serialize(obj));
};


// For parsing multipart/dataform
import multer from "multer";

// const storage = multer.memoryStorage();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let webpage = req.body.webpage;
    cb(null, `public/images/${webpage}/`);
  },
  filename: async function (req, file, cb) {
    // Make sure the original name isn't already used in the server.
    let webpage = req.body.webpage;
    let filenames = await fs.promises.readdir(`public/images/${webpage}`);

    let filename = file.originalname;
    if (!filenames.includes(filename)) {
      cb(null, filename);
    }
    else {
      // Get primary and secondary filename of the file being saved.
      let parts_of_filename = file.originalname.split(".");
      let primary_filename = "";
      for (let i = 0; i < parts_of_filename.length - 1; i++) {
        primary_filename += parts_of_filename[i] + ".";
      }
      let file_extension = parts_of_filename.slice(-1)[0];

      // Check if a file with that name already exists.
      filename = primary_filename + file_extension;
      let i = 1;
      while (filenames.includes(filename)) {
        filename = `${primary_filename}${i}.${file_extension}`;
        i++;
      }

      // Finally, rename the file in the filesystem.
      cb(null, filename);
    }
  }
});

const upload = multer({ storage: storage });




let DATABASE_NAME = "sura";

const api = express.Router();

let conn = null;
let db = null;
let webpages = null;
let admins = null;
let navbars = null;

const initAPI = async app => {
  app.set("json spaces", 2);
  app.use("/api", api);

  // Initialize database connection
  conn = await MongoClient.connect("mongodb://localhost");
  db = conn.db(DATABASE_NAME);
  webpages = db.collection("webpages");
  admins = db.collection("admins");
  navbars = db.collection("navbars");
};

api.use(bodyParser.json({limit: '50mb'}));
api.use(cors());

api.get("/", (req, res) => {
  res.json({ db: DATABASE_NAME });
});

// Adding endpoints here:
// express.static(path.join(__dirname, '/public'));



////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////    Google Authentication    ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

// For Authentication (Google).
// Verifies the JWT.
api.use("/protected", async (req, res, next) => {
  const error = () => { res.status(403).json({ error: "Access denied" }); };
  let header = req.header("Authorization");
  /* `return error()` is a bit cheesy when error() doesn't return anything, but it works (returns undefined) and is convenient. */
  if (!header) return error();
  let [type, value] = header.split(" ");
  if (type !== "Bearer") return error();
  try {
    let verified = jwt.verify(value, JWT_SECRET);
    //TODO: verified contains whatever object you signed, e.g. the user's email address.
    //Use this to look up the user and set res.locals accordingly

    // To be used if there will be admin, then someone below them, etc. etc. so that we can differentiate the priviledges between them.

    next();
  } catch (e) {
    console.error(e);
    error();
  }
});


// For Google Login
api.post("/login", async (req, res) => {
  let idToken = req.body.idToken;
  let client = new OAuth2Client();
  try {
    /* "audience" is the client ID the token was created for. A mismatch would mean the user is
       trying to use an ID token from a different app */
    let login = await client.verifyIdToken({ idToken, audience: CLIENT_ID });
    /* Contains a bunch of profile info */
    let data = login.getPayload();
    let email = data.email;
    let name = data.name;
    //TODO: Do whatever work you'd like here, such as ensuring the user exists in the database
    /* You can include additional information in the key if you want, as well. */

    // Check if user is in database, if not, deny login.
    let list_of_admins = await admins.find().toArray();
    let admin_emails = [];
    for (let admin of list_of_admins) {
      admin_emails.push(admin["email"]);
    }
    if (!admin_emails.includes(email)) {
      res.status(404).json({ error: `The user is not an admin. Access denied.`});
      return;
    }


    let apiKey = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ apiKey });
  } catch (e) {
    /* Something when wrong when verifying the token. */
    console.error(e);
    res.status(403).json({ error: "Invalid ID token" });
  }
});



////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////    File System Reports    /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Sends the list of webpage urls.
api.get("/protected/urls", async (req, res) => {
  let files_batch_1 = await fs.promises.readdir("public");
  for (let i = 0; i < files_batch_1.length; i++) {
    files_batch_1[i] = `/${files_batch_1[i]}`;
  }

  let files_batch_2 = await fs.promises.readdir("public/html_not_core");
  for (let i = 0; i < files_batch_2.length; i++) {
    files_batch_2[i] = `/html_not_core/${files_batch_2[i]}`;
  }

  let urls = [];
  let files = files_batch_1.concat(files_batch_2);
  for (let i = 0; i < files.length; i++) {
    if (path.extname(files[i]) == ".html") {
      urls.push(files[i]);
    }
  }
  res.json(urls);
});



api.post("/protected/images", upload.single("image"), async (req, res) => {
  let image = req.file;
  res.json(image.filename);
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////    Database Collection: Webpages    ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Sends the list of webpages in the database.
api.get("/protected/webpages", async (req, res) => {
  let list_of_webpages = await webpages.find().toArray();
  let webpage_ids = [];
  for (let webpage of list_of_webpages) {
    webpage_ids.push(webpage["id"]);
  }
  res.json(webpage_ids);
});


// Loads webpage data.
api.get("/webpages/:id", async (req, res) => {
  let id = req.params.id;

  // Handles error
  let list_of_webpages = await webpages.find().toArray();
  let webpage_ids = [];
  for (let webpage of list_of_webpages) {
    webpage_ids.push(webpage["id"]);
  }
  if (!webpage_ids.includes(id)) {
    res.status(404).json({ error: `No webpage with ID ${id}` });
    return;
  }

  // If no error
  let webpage = await webpages.findOne({ "id" : id });
  delete webpage["_id"];

  res.json(webpage);
});


// Checks if webpage exists.
api.get("/protected/webpages/:id", async (req, res) => {
  let id = req.params.id;

  let list_of_webpages = await webpages.find().toArray();
  let webpage_ids = [];
  for (let webpage of list_of_webpages) {
    webpage_ids.push(webpage["id"]);
  }
  if (webpage_ids.includes(id)) {
    res.json({"Page Exists" : true});
  }
  else {
    res.json({"Page Exists" : false});
  }
});


// Updates webpage data.
api.patch("/protected/webpages/:id", async (req, res) => {
  let id = req.params.id;
  let webpage_name = id.slice(0, -5);

  // Handles error
  let list_of_webpages = await webpages.find().toArray();
  let webpage_ids = [];
  for (let webpage of list_of_webpages) {
    webpage_ids.push(webpage["id"]);
  }
  if (!webpage_ids.includes(id)) {
    res.status(404).json({ error: `The webpage does not exist.`});
    return;
  }

  // If no error
  // Update database
  let webpage_update = req.body;
  let webpage = await webpages.findOne({ "id" : id});
  let prior_data = structuredClone(webpage);

  for (let key of Object.keys(webpage_update)) {
    if (key != "id") {
      webpage[key] = webpage_update[key];
    }
  }
  await webpages.replaceOne({"id" : id}, webpage);

  // Delete unused images from server
  let current_images = [];
  let prior_images = [];

  for (let article of webpage["articles"]) {
    current_images = current_images.concat(article["images"]);
  }

  for (let article of prior_data["articles"]) {
    prior_images = prior_images.concat(article["images"]);
  }

  for (let image of prior_images) {
    if (image !== "" && !current_images.includes(image)) {
      // let image_name = image.split("/").slice(-1)[0];
      let file_path = `public${image}`;
      fs.unlink(file_path, (err) => {
        if (err) {
          console.log("Error Found:", err);
          throw err;
        }
      });
    }
  }
  res.json(webpage);
  // res.json({"current" : current_images, "prior": prior_images});
});


// Adds new webpage to webpage data and creates the webpage itself in the file system.
api.post("/protected/webpages", async (req, res) => {
  // Handles error
  if (!("id" in req.body) || !req.body.id) {
    res.status(400).json({ error: `No webpage ID was specified!`});
    return;
  }

  let id = req.body.id;

  let list_of_webpages = await webpages.find().toArray();
  let webpage_ids = [];
  for (let webpage of list_of_webpages) {
    webpage_ids.push(webpage["id"]);
  }
  if (webpage_ids.includes(id)) {
    res.status(400).json({ error: `A webpage with this ID already exists.`});
    return;
  }

  // If no error, add to MongoDB collection "webpages".
  let webpage = {
    "id" : id,
    "title" : "Page Title",
    "articles" : []
  };
  await webpages.insertOne(webpage);

  // Make new webpage for it.
  let file_name = "public/html_not_core/" + id;
  fs.copyFile("public/default-page.html", file_name, (err) => {
    if (err) {
      console.log("Error Found:", err);
      throw err;
    }
  });

  // If an image directory exists with this name, delete it.
  let dir_name = id.slice(0,-5);
  let folders = await fs.promises.readdir("public/images");
  if (folders.includes(dir_name)) {
    await fs.promises.rm(`public/images/${dir_name}`, { recursive: true });
  }

  // Make new image directory for it.
  fs.mkdir(`public/images/${dir_name}`, (err) => {
    if (err) {
      console.log("Error Found:", err);
      throw err;
    }
  });


  // The code below is for testing.
  // fs.writeFile("public/newfile.txt", 'Learn Node FS module', function (err) {
  //   if (err) throw err;
  //   console.log('File is created successfully.');
  // });

  res.json(webpage);
});


// Deletes an existing webpage and its related data.
api.delete("/protected/webpages/:id", async (req, res) => {
  let id = req.params.id;

  // handles error
  let list_of_webpages = await webpages.find().toArray();
  let webpage_ids = [];
  for (let webpage of list_of_webpages) {
    webpage_ids.push(webpage["id"]);
  }
  if (!webpage_ids.includes(id)) {
    res.status(404).json({ error: `The webpage ${id} does not exist.`});
    return;
  }

  // let target = req.query.target;
  // if (!target) {
  //   res.status(400).json({ error: `No webpage was specified.`});
  //   return;
  // }

  // Do not delete if this is a core file
  let folders = await fs.promises.readdir("public");
  if (folders.includes(id)) {
    return res.json({"Message" : "Cannot delete a core HTML file."});
  }

  // Deletes the webpage itself.
  let file_name = "public/html_not_core/" + id;
  fs.unlink(file_name, (err) => {
    if (err) {
      console.log("Error Found:", err);
      throw err;
    }
  });

  // Delete the image directory for the webpage.
  let dir_name = id.slice(0,-5);
  fs.rm(`public/images/${dir_name}`, { recursive: true }, (err) => {
    if (err) {
      console.log("Error Found:", err);
      throw err;
    }
  });


  // Deletes the webpage data in MondoDB.
  await webpages.deleteOne({"id":id});

  // Delete the webpage link from navbar.
  let navbar_data = await navbars.find().toArray();
  for (let webpage of navbar_data) {
    let need_update = false;
    for (let i = 0; i < webpage["links"].length; i++) {
      let link = webpage["links"][i];
      let name_of_linked_page = link[1].split("/").slice(-1)[0];
      if (name_of_linked_page === id) {
        webpage["links"].splice(i, 1);
        i--;
        need_update = true;
      }
    }

    if (need_update) {
      await navbars.replaceOne({id : webpage["id"]}, webpage);
    }
  }


  // let following = user["following"];
  // if (!following.includes(target)) {
  //   res.status(400).json({ error: `${id} does not follow ${target}.`});
  //   return;
  // }

  // If no error
  // let index = user["following"].indexOf(target);
  // user["following"].splice(index, 1);
  // await users.replaceOne({"id" : id}, user);

  res.json( {"Message" : "Success"} );
});



////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////    Database Collection: Navbars    ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Loads primary navbar data.
api.get("/navbars", async (req, res) => {
  let navbar = await navbars.findOne({ "id" : "website" });
  res.json(navbar.links);
});


// When nav bar is edited.
api.patch("/protected/navbars/:id", async (req, res) => {
  let id = req.params.id;

  // Handles error
  // let list_of_webpages = await navbars.find().toArray();
  // let webpage_ids = [];
  // for (let webpage of list_of_webpages) {
  //   webpage_ids.push(webpage["id"]);
  // }
  // if (!webpage_ids.includes(id)) {
  //   res.status(404).json({ error: `The navbar data for this webpage does not exist.`});
  //   return;
  // }

  // If no error
  let navbar_update = req.body;
  let primary_navbar = await navbars.findOne({ "id" : "website" });
  // let secondary_navbar = await navbars.findOne({ "id" : id});

  primary_navbar["links"] = navbar_update["primary_navbar"];
  // secondary_navbar["links"] = navbar_update["secondary_navbar"];

  let navbar_data_in_database = {};
  navbar_data_in_database["primary_navbar"] = await navbars.replaceOne({"id" : "website"}, primary_navbar);
  // navbar_data_in_database["secondary_navbar"] = await navbars.replaceOne({"id" : id}, secondary_navbar);

  res.json(navbar_data_in_database);
});


// When webpage is created, creates secondary nav bar data for the webpage.
api.post("/protected/navbars", async (req, res) => {
  // Handles error
  if (!("id" in req.body) || !req.body.id) {
    res.status(400).json({ error: `No webpage ID was specified!`});
    return;
  }

  let id = req.body.id;

  let list_of_webpages = await webpages.find().toArray();
  let webpage_ids = [];
  for (let webpage of list_of_webpages) {
    webpage_ids.push(webpage["id"]);
  }
  if (webpage_ids.includes(id)) {
    res.status(400).json({ error: `A webpage with this ID already exists.`});
    return;
  }

  // If no error, add to MongoDB collection "webpages".
  let webpage = {
    "id" : id,
    "articles" : []
  };
  await webpages.insertOne(webpage);

  // Make new webpage for it.
  let file_name = "public/html_not_core/" + id;
  fs.copyFile("public/default-page.html", file_name, (err) => {
    if (err) {
      console.log("Error Found:", err);
      throw err;
    }
  });
  // The code below is for testing.
  // fs.writeFile("public/newfile.txt", 'Learn Node FS module', function (err) {
  //   if (err) throw err;
  //   console.log('File is created successfully.');
  // });

  res.json(webpage);
});



/* Catch-all route to return a JSON error if endpoint not defined */
api.all("/*", (req, res) => {
  res.status(404).json({ error: `Not found: ${req.method} ${req.url}` });
});

export default initAPI;
