import { isFileEditionValid, isFileDirValid } from "../misc.js";

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

export function deriveHTMLDocKeyFromDocInfo(source, lang, file, edition) {
  if (!source || !lang || !file) {
    return null;
  }
  let docKey = `${source}/${lang}/${file}`;
  if (edition === undefined || edition === null) {
    docKey += ".html";
    return docKey;
  }
  if (isFileEditionValid(edition)) {
    docKey += `@${edition}.html`;
    return docKey;
  }
  return null;
}

export function getHTMLDocByDocInfo(htmlDocs, docInfo) {
  const docKey = deriveHTMLDocKeyFromDocInfo(docInfo.source, docInfo.lang, docInfo.file, docInfo.options?.edition);
  if (!docKey) {
    return null;
  }
  return htmlDocs[docKey] ?? null;
}
