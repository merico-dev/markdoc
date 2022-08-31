import { retrieveDocs } from "./controllers/docs.js";

export function handleHello() {
  return "Hello, Markdoc";
}

export function handleVersion() {
  return {
    packageVersion: process.env.npm_package_version,
    buildVersion: process.env.BUILD_VERSION,
    buildHash: process.env.BUILD_HASH,
  };
}

export function handleDocs(request) {
  return retrieveDocs(request.payload, request.allDocs);
}
