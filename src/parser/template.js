import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Handlebars from "handlebars";

import { DOC_ENCODING } from "../misc.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const markdownTemplate = fs.readFileSync(path.join(__dirname, "../../template/", "github-markdown-light.hbs"), DOC_ENCODING);

export function compileWithTemplate(content, metadata) {
  Handlebars.registerPartial("content", content);
  const template = Handlebars.compile(markdownTemplate);
  const html = template({
    title: metadata.title || "",
  });
  Handlebars.unregisterPartial("content");
  return html;
}
