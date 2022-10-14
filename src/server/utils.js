import { isFileVersionValid } from "../misc.js";

export function deriveHTMLDocKeyFromDocInfo(key, lang, version) {
  let docKey = `${lang}/${key}`;
  if (isFileVersionValid(version)) {
    docKey += `@${version}`;
  }
  docKey += ".html";
  return docKey;
}
