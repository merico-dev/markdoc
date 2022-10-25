import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Handlebars from "handlebars";

import { DOC_ENCODING, doesStrConsistOfEngCharacters } from "../misc.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const markdownTemplate = fs.readFileSync(path.join(__dirname, "../../template/", "github-markdown-light.hbs"), DOC_ENCODING);

function createHandlebarsRootHelper(attrData) {
  function helper(options) {
    const attributes = Object.entries(attrData)
      .filter(([attrKey, attrValue]) => {
        // 凡是属性名包含英文字符以外的数据一律过滤掉
        // 凡是属性值为 undefined/null 的数据一律过滤掉
        return doesStrConsistOfEngCharacters(attrKey) && attrValue !== undefined && attrValue !== null;
      })
      .map(([attrKey, attrValue]) => `data-${attrKey}="${Handlebars.escapeExpression(attrValue)}"`)
      .join(" ");
    return new Handlebars.SafeString(`
      <div id="root" class="root-container" ${attributes}>
        ${options.fn(this)}
      </div>
    `);
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
