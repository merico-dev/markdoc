import { handleHello, handleDocs } from "./handler.js";

export function initRouters(serverInstance) {
  serverInstance.route({
    method: "GET",
    path: "/",
    handler: handleHello,
  });

  serverInstance.route({
    method: "POST",
    path: "/api/v1/docs",
    handler: handleDocs,
  });
}
