import path from "path";
import { fileURLToPath } from "url";
import { keyBy } from "lodash-es";

import { readAndParseMarkdownDocs } from "./parser/main.js";
import { serve } from "./server/main.js";

const MARKDOWN_READ_PATH = "../md";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function readAllDocs() {
  const allDocs = readAndParseMarkdownDocs(path.join(__dirname, MARKDOWN_READ_PATH), {
    sanitize: true,
    minify: true,
  });
  return keyBy(allDocs, "relativePath");
}

function run() {
  const allDocs = readAllDocs();
  serve(allDocs);
}

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

run();
