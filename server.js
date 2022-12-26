import express from "express";
import http from "http";
import path from "path";

import initAPI from "./api/index.js";
import updater from "./lib/server/updater.js";

const PORT = process.env.PORT || 1930; // Uncomment for production
// const PORT = 1930;     // Uncomment for development

const app = express();
const server = http.createServer(app);

const dirname = process.cwd();
const publicPath = path.join(dirname, "public");
console.log(`Serving files from ${publicPath}`);
app.use("/lib/client", express.static(path.join(dirname, "lib/client")));
// -------------------------------------------------- MY CODE ----------------------------------------------------- //

// Serves persistent files from outside code that will be updated in GitHub repo so that they don't get overridden when webpage redeploys after new Git commit.
const persistentDataPath = path.join(dirname, "..", "data");
app.use("/data", express.static(persistentDataPath));

// Serves non-core html file at root so that webpage url is simple.
const webpagesPath = path.join(persistentDataPath, "webpages");
app.use(express.static(webpagesPath));

// ---------------------------------------------------------------------------------------------------------------- //
app.use(express.static(publicPath));
updater(server, publicPath);

const main = async () => {
  await initAPI(app);
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
  });
};
main();