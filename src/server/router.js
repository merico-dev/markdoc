import { handleHello, handleVersion, handleDocs } from "./handler.js";

export function initRouters(serverInstance) {
  serverInstance.route({
    method: "GET",
    path: "/",
    handler: handleHello,
  });
  serverInstance.route({
    method: "GET",
    path: "/api/v2/version",
    handler: handleVersion,
  });
  serverInstance.route({
    method: "POST",
    path: "/api/v2/docs",
    handler: handleDocs,
  });
}
