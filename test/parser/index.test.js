import { expect } from "@hapi/code";
import * as Lab from "@hapi/lab";

import { getAllDocsForPublishing } from "../../src/parser/main.js";

const lab = Lab.script();
const { suite, test, before } = lab;

suite("Testing Parser", () => {
  let allDocs;

  before(() => {
    allDocs = getAllDocsForPublishing();
  });

  test("documents should be loaded successfully and parsed correctly", () => {
    expect(allDocs).to.be.an.array();
    expect(allDocs.length).to.be.at.least(1);

    const doc = allDocs.find(item => item.relativePath === "en/test@3.html");
    expect(doc).to.exist();
    expect(doc.version).to.equal(3);
    expect(doc.info.title).to.equal("Manchester by the Sea V3");
    expect(doc.info.release).to.be.a.string();
    expect(new Date(doc.info.release)).to.be.a.date();
    expect(doc.data).to.be.a.string();
  });
});

// you have to export a lab script when running tests with lab
export { lab };
