import { getHTMLDocByDocInfo } from "../utils.js";

import { queryFragmentsFromHtmlDoc } from "./selectors/sections.js";

export function retrieveDocs(criteria, htmlDocs) {
  if (!Array.isArray(criteria) || criteria.length < 1) {
    return [];
  }
  const results = [];
  criteria.forEach(item => {
    const doc = getHTMLDocByDocInfo(htmlDocs, item);
    if (!doc) {
      results.push(null);
      return;
    }
    results.push({
      criterion: item,
      sourceHash: doc.sourceHash,
      lang: doc.lang,
      edition: doc.edition,
      info: doc.info,
      data: queryFragmentsFromHtmlDoc(doc.data, item.options?.sections),
    });
  });
  return results;
}
