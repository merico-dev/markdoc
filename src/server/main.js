import { Server } from "@hapi/hapi";
import HapiPino from "hapi-pino";

import { initRouters } from "./router.js";

export function createServer(host = "localhost", port = 3000) {
  const server = Server({
    host,
    port,
    routes: {
      cors: true,
    },
    state: {
      strictHeader: false,
    },
  });
  return server;
}

function decorateServer(serverInstance, markdownManifest, allDocs) {
  if (!Array.isArray(markdownManifest)) {
    throw new Error("Server decorating error: manifest not found");
  }
  if (!allDocs) {
    throw new Error("Server decorating error: documents not found");
  }
  serverInstance.decorate("request", "markdownManifest", markdownManifest);
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

export async function startServer(serverInstance, markdownManifest, allDocs) {
  decorateServer(serverInstance, markdownManifest, allDocs);
  await registerPlugins(serverInstance);
  initRouters(serverInstance);

  await serverInstance.start();
  console.log(`\nServer@${process.env.npm_package_version} running at: ${serverInstance.info.uri}\n`);
}

// just for testing
export async function initServer(serverInstance, markdownManifest, allDocs) {
  decorateServer(serverInstance, markdownManifest, allDocs);
  initRouters(serverInstance);

  await serverInstance.initialize();
  console.log(`\nServer@${process.env.npm_package_version} initialized at: ${serverInstance.info.uri}\n`);
}
