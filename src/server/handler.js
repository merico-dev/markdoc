import { retrieveDocs } from "./controllers/docs.js";

export function handleHello() {
  return "Hello, Markdoc";
}

export function handleDocs(request) {
  return retrieveDocs(request.payload, request.allDocs);
}
