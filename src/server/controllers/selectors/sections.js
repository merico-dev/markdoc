import { JSDOM } from "jsdom";

export function queryFragmentsFromHtmlDoc(htmlDoc, sections) {
  const list = [];
  if (!Array.isArray(sections) || sections.length < 1) {
    list.push(htmlDoc);
  } else {
    const fragment = JSDOM.fragment(htmlDoc);
    sections.forEach(item => {
      const element = fragment.querySelector(`[data-section=${item}]`);
      list.push(element?.outerHTML ?? null);
    });
  }
  return list;
}
