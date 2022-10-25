import fs from "fs";
import path from "path";

export const DOC_ENCODING = "utf8";

export function doesStrConsistOfEngCharacters(str) {
  if (typeof str !== "string") {
    return false;
  }
  return (/^[a-zA-Z]+$/).test(str);
}

export function isUnixHiddenPath(filePath) {
  return (/(^|\/)\.[^\/\.]/g).test(filePath);
}

export function readFilePathListSync(fromPath, extension) {
  const pathList = [];

  const traverseFilePath = (startPath) => {
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
    fs.writeFileSync(item.path, item.data, DOC_ENCODING);
  });
}

export function isFileVersionValid(version) {
  return Number.isSafeInteger(version) && version >= 1;
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
export function deriveFileVersionFromFileName(fileName) {
  if (typeof fileName !== "string") {
    return null;
  }
  const [, fileVersionStr] = splitOnce(fileName, "@");
  const fileVersion = Number(fileVersionStr);
  return isFileVersionValid(fileVersion) ? fileVersion : null;
}

// 关于文件语言的定义规则请见「README」
export function deriveFileLangFromFileDir(fileDir) {
  if (typeof fileDir !== "string") {
    return null;
  }
  const [lang] = fileDir.split(path.sep);
  return lang ? lang : null;
}
