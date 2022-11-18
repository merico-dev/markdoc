import { isFileEdtionValid, isFileDirValid } from "../misc.js";

export function deriveMarkdownSourceVersionInfoFromManifest(markdownManifest) {
  if (!Array.isArray(markdownManifest) || markdownManifest.length < 1) {
    return;
  }
  const versionInfo = {};
  markdownManifest.forEach(item => {
    if (isFileDirValid(item.key)) {
      versionInfo[`${item.key}Hash`] = item.hash;
    }
  });
  return versionInfo;
}

export function deriveHTMLDocKeyFromDocInfo(source, key, lang, edtion) {
  if (!source || !key || !lang) {
    return null;
  }
  let docKey = `${source}/${lang}/${key}`;
  if (edtion === undefined || edtion === null) {
    docKey += ".html";
    return docKey;
  }
  if (isFileEdtionValid(edtion)) {
    docKey += `@${edtion}.html`;
    return docKey;
  }
  return null;
}

export function getHTMLDocByDocInfo(htmlDocs, docInfo) {
  const docKey = deriveHTMLDocKeyFromDocInfo(docInfo.source, docInfo.key, docInfo.lang, docInfo.edtion);
  if (!docKey) {
    return null;
  }
  return htmlDocs[docKey] ?? null;
}
