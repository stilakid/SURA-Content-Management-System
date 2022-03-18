import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { MongoClient } from "mongodb";

// Import the filesystem module
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require('fs');

let DATABASE_NAME = "sura";

const api = express.Router();

let conn = null;
let db = null;
let webpages = null;

const initAPI = async app => {
  app.set("json spaces", 2);
  app.use("/api", api);

  // Initialize database connection
  conn = await MongoClient.connect("mongodb://localhost");
  db = conn.db(DATABASE_NAME);
  webpages = db.collection("webpages");
};

api.use(bodyParser.json());
api.use(cors());

api.get("/", (req, res) => {
  res.json({ db: DATABASE_NAME });
});

// Adding endpoints here:
// express.static(path.join(__dirname, '/public'));

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


// Updates webpage data.
api.patch("/webpages/:id", async (req, res) => {
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


// Adds new webpage to webpage data.
api.post("/webpages", async (req, res) => {
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
    "id" : id + ".html",
    "articles" : []
  };
  await webpages.insertOne(webpage);

  // Make new webpage for it.
  let file_name = "public/" + id + ".html";
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


/* Catch-all route to return a JSON error if endpoint not defined */
api.all("/*", (req, res) => {
  res.status(404).json({ error: `Not found: ${req.method} ${req.url}` });
});

export default initAPI;
