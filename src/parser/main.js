import path from "path";
import { fileURLToPath } from "url";
import { keyBy } from "lodash-es";

import { readFilePathListSync, isFileVersionValid, splitOnce } from "../misc.js";

import { readAndParseFrontMatter } from "./front-matter.js";
import { parseMarkdown } from "./markup.js";
import { purifyHtml } from "./purify.cjs";
import { compileWithTemplate } from "./template.js";
import { minifyHtml } from "./minify.js";

const MARKDOWN_READ_PATH = "../../md";
const MARKDOWN_EXTENSION = "md";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function readAllMarkdownDocs(readPath) {
  const pathList = readFilePathListSync(readPath, MARKDOWN_EXTENSION);
  const docs = [];
  pathList.forEach(item => {
    try {
      docs.push({
        relativePath: path.relative(readPath, item),
        data: readAndParseFrontMatter(item),
      });
    } catch(err) {
      console.error(err);
    }
  });
  return docs;
}

function parseMarkdownDocs(markdownDocs, options = {
  sanitize: false,
  decorate: false,
  minify: false,
}) {
  const htmlDocs = [];
  markdownDocs.forEach(item => {
    const { relativePath, data } = item;
    const { dir, name } = path.parse(relativePath);
    const [, fileVersion] = splitOnce(name, "@");
    const fileVersionNum = Number(fileVersion);

    // parse markdown
    let html = parseMarkdown(data.content);
    // purify html
    if (options?.sanitize) {
      html = purifyHtml(html);
    }
    // decorate html
    if (options?.decorate) {
      html = compileWithTemplate(html, { ...data.data });
    }
    // minify html
    if (options?.minify) {
      html = minifyHtml(html);
    }

    htmlDocs.push({
      relativePath: `${dir}/${name}.html`,
      version: isFileVersionValid(fileVersionNum) ? fileVersionNum : null,
      info: data.data,
      data: html,
    });
  });
  return htmlDocs;
}

function readAndParseMarkdownDocs(readPath, options) {
  const markdownDocs = readAllMarkdownDocs(readPath);
  const htmlDocs = parseMarkdownDocs(markdownDocs, options);
  return htmlDocs;
}

export function getAllDocsForPublishing() {
  return readAndParseMarkdownDocs(path.join(__dirname, MARKDOWN_READ_PATH), {
    sanitize: true,
    decorate: true,
    minify: true,
  });
}

export function getAllDocsForServing() {
  const allDocs = readAndParseMarkdownDocs(path.join(__dirname, MARKDOWN_READ_PATH), {
    sanitize: true,
    minify: true,
  });
  return keyBy(allDocs, "relativePath");
}
