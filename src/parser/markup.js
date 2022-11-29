import { trim } from "lodash-es";
import { marked } from "marked";

marked.setOptions({
  headerIds: false,
});

const CUSTOM_ID_MATCH_REGEX = /\{\[:( ?[a-z_][\w -]*)\]\}/i;
const CUSTOM_ID_MATCH_GLOBAL_REGEX = new RegExp(CUSTOM_ID_MATCH_REGEX, "gi");

const CUSTOM_KEYWORD_MATCH_REGEX = /\{\[;( ?[a-z_][\w -]*)\]\}/i;
const CUSTOM_KEYWORD_MATCH_GLOBAL_REGEX = new RegExp(CUSTOM_KEYWORD_MATCH_REGEX, "gi");

function appendCustomAttributes(text) {
  let attr = "";
  let content = text;
  const idMatched = text.match(CUSTOM_ID_MATCH_REGEX);
  const keywordMatched = text.match(CUSTOM_KEYWORD_MATCH_REGEX);
  if (idMatched) {
    attr += ` id="${trim(idMatched[1])}"`;
    content = content.replace(CUSTOM_ID_MATCH_GLOBAL_REGEX, "");
  }
  if (keywordMatched) {
    attr += ` data-keywords="${trim(keywordMatched[1])}"`;
    content = content.replace(CUSTOM_KEYWORD_MATCH_GLOBAL_REGEX, "");
  }
  return { attr, content };
}

const renderer = {
  heading(text, level) {
    const { attr, content } = appendCustomAttributes(text);
    if (!attr) {
      // fallback to original renderer
      return false;
    }
    return `<h${level}${attr}>${content}</h${level}>\n`;
  },
  paragraph(text) {
    const { attr, content } = appendCustomAttributes(text);
    if (!attr) {
      // fallback to original renderer
      return false;
    }
    return `<p${attr}>${content}</p>\n`;
  },
  code(...args) {
    const html = marked.Renderer.prototype.code.call(this, ...args);
    return html.replace(/\n<\/code>/, "</code>");
  },
};

marked.use({ renderer });

export function parseMarkdown(doc) {
  return marked.parse(doc);
}
