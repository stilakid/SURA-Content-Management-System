// WELCOME TO THE BACKEND!!! MUUAAAAHAHAHAHAHAAAAAA T^T

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

// Import the filesystem module
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require('fs');

let DATABASE_NAME = "sura";

const api = express.Router();

let conn = null;
let db = null;
let webpages = null;
let admins = null;

const initAPI = async app => {
  app.set("json spaces", 2);
  app.use("/api", api);

  // Initialize database connection
  conn = await MongoClient.connect("mongodb://localhost");
  db = conn.db(DATABASE_NAME);
  webpages = db.collection("webpages");
  admins = db.collection("admins");
};

api.use(bodyParser.json());
api.use(cors());

api.get("/", (req, res) => {
  res.json({ db: DATABASE_NAME });
});

// Adding endpoints here:
// express.static(path.join(__dirname, '/public'));

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
  let webpage_update = req.body;
  let webpage = await webpages.findOne({ "id" : id});

  for (let key of Object.keys(webpage_update)) {
    if (key != "id") {
      webpage[key] = webpage_update[key];
    }
  }
  await webpages.replaceOne({"id" : id}, webpage);

  res.json(webpage);
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
    "articles" : []
  };
  await webpages.insertOne(webpage);

  // Make new webpage for it.
  let file_name = "public/html_not_core/" + id;
  fs.copyFile("public/default-page.html", file_name, (err) => {
    if (err) {
      console.log("Error Found:", err);
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

  // Deletes the webpage data in MondoDB.
  await webpages.deleteOne({"id":id});

  // Deletes the webpage itself.
  let file_name = "public/html_not_core/" + id;
  fs.unlink(file_name, (err) => {
    if (err) {
      throw err;
    }
  });


  // let following = user["following"];
  // if (!following.includes(target)) {
  //   res.status(400).json({ error: `${id} does not follow ${target}.`});
  //   return;
  // }

  // If no error
  // let index = user["following"].indexOf(target);
  // user["following"].splice(index, 1);
  // await users.replaceOne({"id" : id}, user);

  res.json( {"success" : true} );
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




/* Catch-all route to return a JSON error if endpoint not defined */
api.all("/*", (req, res) => {
  res.status(404).json({ error: `Not found: ${req.method} ${req.url}` });
});

export default initAPI;
