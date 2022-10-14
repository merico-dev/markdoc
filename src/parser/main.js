import path from "path";

import { readFilePathListSync, isFileVersionValid, splitOnce } from "../misc.js";

import { readAndParseFrontMatter } from "./front-matter.js";
import { parseMarkdown } from "./markup.js";
import { purifyHtml } from "./purify.cjs";
import { compileWithTemplate } from "./template.js";
import { minifyHtml } from "./minify.js";

const MARKDOWN_EXTENSION = "md";

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
    const splitNameInfo = splitOnce(name, "@");
    const fileVersionNum = Number(splitNameInfo[1]);

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
      fileVersion: isFileVersionValid(fileVersionNum) ? fileVersionNum : null,
      info: data.data,
      data: html,
    });
  });
  return htmlDocs;
}

export function readAndParseMarkdownDocs(readPath, options) {
  const markdownDocs = readAllMarkdownDocs(readPath);
  const htmlDocs = parseMarkdownDocs(markdownDocs, options);
  return htmlDocs;
}
