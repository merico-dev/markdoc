import dotenv from "dotenv";

import { getAllDocsForServing } from "./parser/main.js";
import { createServer, startServer } from "./server/main.js";

function run() {
  dotenv.config();
  const server = createServer();
  const allDocs = getAllDocsForServing();
  startServer(server, allDocs);
}

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

run();
