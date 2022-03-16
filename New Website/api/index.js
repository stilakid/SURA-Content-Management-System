import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { MongoClient } from "mongodb";

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

//TODO: Add endpoints
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


/* Catch-all route to return a JSON error if endpoint not defined */
api.all("/*", (req, res) => {
  res.status(404).json({ error: `Not found: ${req.method} ${req.url}` });
});

export default initAPI;
