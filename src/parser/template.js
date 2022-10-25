import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Handlebars from "handlebars";

import { DOC_ENCODING } from "../misc.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const markdownTemplate = fs.readFileSync(path.join(__dirname, "../../template/", "github-markdown-light.hbs"), DOC_ENCODING);

function createHandlebarsRootHelper(attrData) {
  function helper(options) {
    const attributes = Object.entries(attrData)
      .filter(([, attrValue]) => {
        return attrValue !== undefined && attrValue !== null;
      })
      .map(([attrKey, attrValue]) => `data-${attrKey}="${attrValue}"`)
      .join(" ");
    return `
      <div id="root" class="root-container" ${attributes}>
        ${options.fn(this)}
      </div>
    `;
  }
  return helper;
}

export function compileWithTemplate(content, info, metadata = {}) {
  Handlebars.registerPartial("content", content);
  Handlebars.registerHelper("root", createHandlebarsRootHelper(metadata));

  const template = Handlebars.compile(markdownTemplate);
  const html = template({
    title: info.title || "",
    lang: metadata.lang,
  });

  Handlebars.unregisterHelper("root");
  Handlebars.unregisterPartial("content");

  return html;
}
