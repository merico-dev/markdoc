import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { writeFiles } from "./misc.js";
import { getAllDocsForPublishing } from "./parser/main.js";

const HTML_WRITE_PATH = "../public/docs";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function cleanTargetDir(targetPath) {
  fs.rmSync(targetPath, { recursive: true, force: true });
}

function writeHtmlDocs(htmlDocs) {
  const files = htmlDocs.map(item => ({
    path: path.join(__dirname, HTML_WRITE_PATH, item.relativePath),
    data: item.data,
  }));
  writeFiles(files);
}

function run() {
  const allDocs = getAllDocsForPublishing();
  cleanTargetDir(path.join(__dirname, HTML_WRITE_PATH));
  writeHtmlDocs(allDocs);
}

run();
