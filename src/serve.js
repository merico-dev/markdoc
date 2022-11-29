import dotenv from "dotenv";

import logger from "./logger.js";
import { getMarkdownManifest } from "./misc.js";
import { getAllDocsForServing } from "./parser/main.js";
import { createServer, startServer } from "./server/main.js";

function run() {
  dotenv.config();
  const { manifestFilePath, manifest } = getMarkdownManifest(process.env.MARKDOWN_MANIFEST);
  const allDocs = getAllDocsForServing(manifestFilePath, manifest);
  const server = createServer(process.env.SERVER_HOST, process.env.SERVER_PORT);
  startServer(server, manifest, allDocs);
}

process.on("unhandledRejection", (err) => {
  logger.fatal(err);
  process.exit(1);
});

run();
