import { isFileVersionValid } from "../misc.js";

export function deriveHTMLDocKeyFromDocInfo(key, lang, version) {
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
