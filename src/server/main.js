import dotenv from "dotenv";
import { Server } from "@hapi/hapi";
import HapiPino from "hapi-pino";

import { initRouters } from "./router.js";

function initServer() {
  const server = Server({
    host: process.env.SERVER_HOST || "localhost",
    port: process.env.SERVER_PORT || 3000,
    routes: {
      cors: true,
    },
  });
  return server;
}

function decorateServer(serverInstance, allDocs) {
  if (!allDocs) {
    throw new Error("Server decorating error: documents not found");
  }
  serverInstance.decorate("request", "allDocs", allDocs);
}

async function registerPlugins(serverInstance) {
  await serverInstance.register({
    plugin: HapiPino,
    options: {
      prettyPrint: false,
      logEvents: ["response", "onPostStart"],
    },
  });
}

async function startServer(serverInstance) {
  await serverInstance.start();
  console.log(`\nServer running at: ${serverInstance.info.uri}\n`);
}

export async function serve(allDocs) {
  dotenv.config();
  const server = initServer();
  decorateServer(server, allDocs);
  await registerPlugins(server);
  initRouters(server);
  await startServer(server);
}
