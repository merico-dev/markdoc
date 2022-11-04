import { isFileVersionValid } from "../misc.js";

export function deriveHTMLDocKeyFromDocInfo(key, lang, version) {
  if (!key || !lang) {
    return null;
  }
  let docKey = `${lang}/${key}`;
  if (version === undefined || version === null) {
    docKey += ".html";
    return docKey;
  }
  if (isFileVersionValid(version)) {
    docKey += `@${version}.html`;
    return docKey;
  }
  return null;
}

export function getHTMLDocByDocInfo(htmlDocs, docInfo) {
  const docKey = deriveHTMLDocKeyFromDocInfo(docInfo.key, docInfo.lang, docInfo.version);
  if (!docKey) {
    return null;
  }
  return htmlDocs[docKey] ?? null;
}
