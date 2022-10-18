import { Server } from "@hapi/hapi";
import HapiPino from "hapi-pino";

import { initRouters } from "./router.js";

export function createServer() {
  const server = Server({
    host: process.env.SERVER_HOST || "localhost",
    port: process.env.SERVER_PORT || 3000,
    routes: {
      cors: true,
    },
    state: {
      strictHeader: false,
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

async function setupServer(serverInstance, allDocs) {
  decorateServer(serverInstance, allDocs);
  await registerPlugins(serverInstance);
  initRouters(serverInstance);
}

export async function startServer(serverInstance, allDocs) {
  await setupServer(serverInstance, allDocs);
  await serverInstance.start();
  console.log(`\nServer@${process.env.npm_package_version} running at: ${serverInstance.info.uri}\n`);
}
