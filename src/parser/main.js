import path from "path";
import { fileURLToPath } from "url";
import { keyBy } from "lodash-es";

import {
  readYamlFile,
  readFilePathListSync,
  deriveFileSourceAndLangFromFileDir,
  deriveFileEdtionFromFileName,
} from "../misc.js";

import { readAndParseFrontMatter } from "./front-matter.js";
import { parseMarkdown } from "./markup.js";
import { purifyHtml } from "./purify.cjs";
import { compileWithTemplate } from "./template.js";
import { minifyHtml } from "./minify.js";

const MARKDOWN_SOURCE_INFO_FILE = "md.yaml";
const MARKDOWN_SOURCE_LIB_DIR = "md/";
const MARKDOWN_EXTENSION = "md";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getManifestFilePath() {
  const manifestPath = process.env.MARKDOWN_MANIFEST;
  if (!manifestPath) {
    return null;
  }
  return path.resolve(__dirname, "../../", manifestPath);
}

function readAllMarkdownDocs(manifestFilePath, markdownManifest) {
  const docs = [];
  const { dir: manifestFileDir } = path.parse(manifestFilePath);
  markdownManifest.forEach(item => {
    try {
      const markdownSourcePath = path.resolve(manifestFileDir, item.path);
      const markdownSourceInfo = readYamlFile(path.join(markdownSourcePath, MARKDOWN_SOURCE_INFO_FILE));
      if (!markdownSourceInfo?.key) {
        return;
      }
      const libPath = path.join(markdownSourcePath, MARKDOWN_SOURCE_LIB_DIR);
      const filePathList = readFilePathListSync(libPath, MARKDOWN_EXTENSION);
      filePathList.forEach(filePath => {
        try {
          docs.push({
            relativePath: path.join(markdownSourceInfo.key, path.relative(libPath, filePath)),
            data: readAndParseFrontMatter(filePath),
          });
        } catch (err) {
          console.error(err);
        }
      });
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
    const { relativePath, data } = item;
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
  const manifestFilePath = getManifestFilePath();
  if (!manifestFilePath) {
    return [];
  }
  const manifest = readYamlFile(manifestFilePath);
  if (!Array.isArray(manifest) || manifest.length < 1) {
    return [];
  }
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
