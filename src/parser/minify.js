import { minify } from "html-minifier";

export function minifyHtml(html) {
  return minify(html, {
    collapseWhitespace: true,
  });
}
