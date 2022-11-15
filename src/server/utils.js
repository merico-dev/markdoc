import { isFileEdtionValid } from "../misc.js";

export function deriveHTMLDocKeyFromDocInfo(key, lang, edtion) {
  if (!key || !lang) {
    return null;
  }
  let docKey = `${lang}/${key}`;
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
  const docKey = deriveHTMLDocKeyFromDocInfo(docInfo.key, docInfo.lang, docInfo.edtion);
  if (!docKey) {
    return null;
  }
  return htmlDocs[docKey] ?? null;
}
