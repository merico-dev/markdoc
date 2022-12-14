import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "yaml";

import logger from "./logger.js";

export const FILE_ENCODING = "utf8";
export const MARKDOWN_SOURCE_INFO_FILE = "md.yaml";
export const MARKDOWN_SOURCE_LIB_DIR = "md/";
export const MARKDOWN_EXTENSION = "md";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// HTML Data Attributes 仅可由小写英文字符和连字符组成
// 且必须以小写英文字符打头和结尾（但不能以 xml 打头），且多个连字符不能相连
export function isDataAttrNamingValid(naming) {
  if (typeof naming !== "string") {
    return false;
  }
  if (naming.toLowerCase().startsWith("xml")) {
    return false;
  }
  return (/^[a-z]([a-z]*\-?[a-z])*$/).test(naming);
}

// 合法的文件 edition 必须为正整数（且小于 2^53）
export function isFileEditionValid(edition) {
  return Number.isSafeInteger(edition) && edition >= 1;
}

// 合法的目录名仅可由英文字符、连字符、下划线组成，且必须以英文字符开头和结尾
export function isFileDirValid(dir) {
  if (typeof dir !== "string") {
    return false;
  }
  return (/^[a-zA-Z]([a-zA-Z]*-*_*[a-zA-Z])*$/).test(dir);
}

export function isUnixHiddenPath(filePath) {
  return (/(^|\/)\.[^\/\.]/g).test(filePath);
}

export function readYamlFile(filePath) {
  let data = null;
  try {
    const file = fs.readFileSync(filePath, FILE_ENCODING);
    data = yaml.parse(file);
  } catch (err) {
    logger.error(err);
  }
  return data;
}

export function getMarkdownManifest(manifestPath) {
  if (!manifestPath) {
    return {
      manifestFilePath: null,
      manifest: null,
    };
  }
  const manifestFilePath = path.resolve(__dirname, "../", manifestPath);
  const { dir: manifestFileDir } = path.parse(manifestFilePath);
  const manifest = readYamlFile(manifestFilePath);
  if (Array.isArray(manifest)) {
    manifest.forEach(item => {
      const markdownSourcePath = path.resolve(manifestFileDir, item.path);
      const markdownSourceInfo = readYamlFile(path.join(markdownSourcePath, MARKDOWN_SOURCE_INFO_FILE));
      item.key = markdownSourceInfo?.key;
      item.name = markdownSourceInfo?.name;
    });
  }
  return {
    manifestFilePath,
    manifest,
  };
}

export function readFilePathListSync(fromPath, extension) {
  const pathList = [];

  const traverseFilePath = (startPath) => {
    if (!fs.existsSync(startPath)) {
      return;
    }
    const direntList = fs.readdirSync(startPath, { withFileTypes: true });
    const validDirentList = direntList.filter(item => !isUnixHiddenPath(item.name));
    validDirentList.forEach(item => {
      const targetPath = path.join(startPath, item.name);
      if (item.isDirectory()) {
        traverseFilePath(targetPath);
      } else if (item.isFile()) {
        if (!extension) {
          pathList.push(targetPath);
        } else if (item.name.toLowerCase().endsWith(`.${extension}`)) {
          pathList.push(targetPath);
        }
      }
    });
  };
  traverseFilePath(fromPath);

  return pathList;
}

export function writeFiles(files) {
  files.forEach(item => {
    const dirPath = path.dirname(item.path);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(item.path, item.data, FILE_ENCODING);
  });
}

export function splitOnce(str, separator) {
  if (typeof str !== "string" || typeof separator !== "string" || !separator) {
    return [str];
  }
  const index = str.indexOf(separator);
  if (index < 0) {
    return [str];
  }
  return [str.slice(0, index), str.slice(index + 1)];
}

// 关于文件版本的定义规则请见「文档版本设计说明」
export function deriveFileEditionFromFileName(fileName) {
  if (typeof fileName !== "string") {
    return null;
  }
  const [, fileEditionStr] = splitOnce(fileName, "@");
  const fileEdition = Number(fileEditionStr);
  return isFileEditionValid(fileEdition) ? fileEdition : null;
}

// 关于文件目录的定义规则请见「README」
export function deriveFileSourceAndLangFromFileDir(fileDir) {
  if (typeof fileDir !== "string") {
    return null;
  }
  const [source, lang] = fileDir.split(path.sep);
  return [
    isFileDirValid(source) ? source : null,
    isFileDirValid(lang) ? lang : null,
  ];
}
