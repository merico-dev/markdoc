import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { writeFiles } from "./misc.js";
import { readAndParseMarkdownDocs } from "./parser/main.js";

const MARKDOWN_READ_PATH = "../md";
const MARKDOWN_WRITE_PATH = "../public/docs";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function cleanTargetDir(targetPath) {
  fs.rmSync(targetPath, { recursive: true, force: true });
}

function writeHtmlDocs(htmlDocs) {
  const files = htmlDocs.map(item => ({
    path: path.join(__dirname, MARKDOWN_WRITE_PATH, item.relativePath),
    data: item.data,
  }));
  writeFiles(files);
}

function run() {
  const htmlDocs = readAndParseMarkdownDocs(path.join(__dirname, MARKDOWN_READ_PATH), {
    sanitize: true,
    decorate: true,
    minify: true,
  });
  cleanTargetDir(path.join(__dirname, MARKDOWN_WRITE_PATH));
  writeHtmlDocs(htmlDocs);
}

run();
