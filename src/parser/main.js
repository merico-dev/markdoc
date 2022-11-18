import path from "path";
import { keyBy } from "lodash-es";

import {
  MARKDOWN_SOURCE_LIB_DIR,
  MARKDOWN_EXTENSION,
  readFilePathListSync,
  getMarkdownManifest,
  isFileDirValid,
  deriveFileSourceAndLangFromFileDir,
  deriveFileEdtionFromFileName,
} from "../misc.js";

import { readAndParseFrontMatter } from "./front-matter.js";
import { parseMarkdown } from "./markup.js";
import { purifyHtml } from "./purify.cjs";
import { compileWithTemplate } from "./template.js";
import { minifyHtml } from "./minify.js";

function readMarkdownSourceDocs(sourceDocsPath, sourceKey, sourceHash) {
  const docs = [];
  const filePathList = readFilePathListSync(sourceDocsPath, MARKDOWN_EXTENSION);
  filePathList.forEach(item => {
    try {
      docs.push({
        relativePath: path.join(sourceKey, path.relative(sourceDocsPath, item)),
        sourceHash: sourceHash ?? null,
        data: readAndParseFrontMatter(item),
      });
    } catch (err) {
      console.error(err);
    }
  });
  return docs;
}

function readAllMarkdownDocs(manifestFilePath, markdownManifest) {
  if (!manifestFilePath || !Array.isArray(markdownManifest) || markdownManifest.length < 1) {
    return [];
  }

  let docs = [];
  const { dir: manifestFileDir } = path.parse(manifestFilePath);
  markdownManifest.forEach(item => {
    try {
      if (!isFileDirValid(item.key)) {
        return;
      }
      const markdownSourcePath = path.resolve(manifestFileDir, item.path);
      const libPath = path.join(markdownSourcePath, MARKDOWN_SOURCE_LIB_DIR);
      const sourceDocs = readMarkdownSourceDocs(libPath, item.key, item.hash);
      docs = docs.concat(sourceDocs);
    } catch (err) {
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
    const { relativePath, sourceHash, data } = item;
    const { dir, name } = path.parse(relativePath);
    const [fileSource, fileLang] = deriveFileSourceAndLangFromFileDir(dir);
    const fileEdtion = deriveFileEdtionFromFileName(name);

    // parse markdown
    let html = parseMarkdown(data.content);
    // purify html
    if (options?.sanitize) {
      html = purifyHtml(html);
    }
    // decorate html
    if (options?.decorate) {
      html = compileWithTemplate(html, data.data, {
        source: fileSource,
        "source-hash": sourceHash,
        lang: fileLang,
        edtion: fileEdtion,
      });
    }
    // minify html
    if (options?.minify) {
      html = minifyHtml(html);
    }

    htmlDocs.push({
      relativePath: `${dir}/${name}.html`,
      sourceHash,
      source: fileSource,
      lang: fileLang,
      edtion: fileEdtion,
      info: data.data,
      data: html,
    });
  });
  return htmlDocs;
}

function readAndParseMarkdownDocs(options) {
  const { manifestFilePath, manifest } = getMarkdownManifest();
  const markdownDocs = readAllMarkdownDocs(manifestFilePath, manifest);
  const htmlDocs = parseMarkdownDocs(markdownDocs, options);
  return htmlDocs;
}

export function getAllDocsForPublishing() {
  return readAndParseMarkdownDocs({
    sanitize: true,
    decorate: true,
    minify: true,
  });
}

export function getAllDocsForServing() {
  const allDocs = readAndParseMarkdownDocs({
    sanitize: true,
    minify: true,
  });
  return keyBy(allDocs, "relativePath");
}
