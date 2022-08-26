import { JSDOM } from "jsdom";

export function retrieveDocs(criteria, htmlDocs) {
  if (!Array.isArray(criteria) || criteria.length < 1) {
    return [];
  }
  const results = [];
  criteria.forEach(item => {
    const docKey = `${item.lang}/${item.key}.html`;
    const doc = htmlDocs[docKey];
    if (!doc) {
      return;
    }
    const result = {
      criterion: item,
      info: doc.info,
      data: [],
    };
    if (!Array.isArray(item.sections) || item.sections.length < 1) {
      result.data.push(doc.data);
      results.push(result);
      return;
    }
    const fragment = JSDOM.fragment(doc.data);
    item.sections.forEach(section => {
      const element = fragment.querySelector(`[data-section=${section}]`);
      result.data.push(element?.outerHTML);
    });
    results.push(result);
  });
  return results;
}
