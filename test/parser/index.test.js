import { expect } from "@hapi/code";
import * as Lab from "@hapi/lab";

import { getAllDocsForPublishing, getAllDocsForServing } from "../../src/parser/main.js";

const lab = Lab.script();
const { suite, test, before } = lab;

suite("Testing Parser", () => {
  let docsForPublishing;
  let docsForServing;

  before(() => {
    docsForPublishing = getAllDocsForPublishing();
    docsForServing = getAllDocsForServing();
  });

  test("documents for publishing should be loaded successfully and parsed correctly", () => {
    expect(docsForPublishing).to.be.an.array();
    expect(docsForPublishing.length).to.be.at.least(1);

    const doc = docsForPublishing.find(item => item.relativePath === "en/test@3.html");
    expect(doc).to.exist();
    expect(doc.version).to.equal(3);
    expect(doc.info.title).to.equal("Manchester by the Sea V3");
    expect(doc.info.release).to.be.a.string();
    expect(new Date(doc.info.release)).to.be.a.date();
    expect(doc.data).to.be.a.string().and.contain(["css"]);
  });

  test("documents for serving should be loaded successfully and parsed correctly", () => {
    expect(docsForServing).to.be.an.object();

    const doc = docsForServing["en/test@3.html"];
    expect(doc).to.exist();
    expect(doc.version).to.equal(3);
    expect(doc.info.title).to.equal("Manchester by the Sea V3");
    expect(doc.info.release).to.be.a.string();
    expect(new Date(doc.info.release)).to.be.a.date();
    expect(doc.data).to.be.a.string().and.not.contain(["css"]);
  });
});

// you have to export a lab script when running tests with lab
export { lab };
