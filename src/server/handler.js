import { deriveMarkdownSourceVersionInfoFromManifest } from "./utils.js";
import { retrieveDocs } from "./controllers/docs.js";

export function handleHello() {
  return "Hello, Markdoc";
}

export function handleVersion(request) {
  return {
    packageVersion: process.env.npm_package_version,
    buildVersion: process.env.BUILD_VERSION,
    buildHash: process.env.BUILD_HASH,
    docsVersionInfo: deriveMarkdownSourceVersionInfoFromManifest(request.markdownManifest),
  };
}

export function handleDocs(request) {
  return retrieveDocs(request.payload, request.allDocs);
}
