const createDOMPurify = require("dompurify");
const jsdom = require("jsdom");

const { JSDOM } = jsdom;

function purifyHtml(html) {
  const { window } = new JSDOM("");
  const DOMPurify = createDOMPurify(window);
  return DOMPurify.sanitize(html);
}

exports.purifyHtml = purifyHtml;
