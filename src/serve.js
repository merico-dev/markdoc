import dotenv from "dotenv";

import { getMarkdownManifest } from "./misc.js";
import { getAllDocsForServing } from "./parser/main.js";
import { createServer, startServer } from "./server/main.js";

function run() {
  dotenv.config();
  const { manifest } = getMarkdownManifest();
  const allDocs = getAllDocsForServing();
  const server = createServer(process.env.SERVER_HOST, process.env.SERVER_PORT);
  startServer(server, manifest, allDocs);
}

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

run();
