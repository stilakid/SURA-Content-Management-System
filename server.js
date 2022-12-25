import express from "express";
import http from "http";
import path from "path";

import initAPI from "./api/index.js";
import updater from "./lib/server/updater.js";

// const PORT = process.env.PORT || 1930; // Uncomment for production
const PORT = 1930;     // Uncomment for development

const app = express();
const server = http.createServer(app);

const dirname = process.cwd();
const publicPath = path.join(dirname, "public");
console.log(`Serving files from ${publicPath}`);
app.use("/lib/client", express.static(path.join(dirname, "lib/client")));
app.use(express.static(publicPath));
updater(server, publicPath);

const main = async () => {
  await initAPI(app);
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
  });
};
main();
