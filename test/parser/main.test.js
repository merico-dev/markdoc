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

  test("getAllDocsForPublishing", () => {
    expect(docsForPublishing).to.be.an.array();
    expect(docsForPublishing.length).to.be.at.least(1);

    const doc = docsForPublishing.find(item => item.relativePath === "en/test@3.html");
    expect(doc).to.exist();
    expect(doc.lang).to.equal("en");
    expect(doc.edtion).to.equal(3);
    expect(doc.info.title).to.equal("Manchester by the Sea V3");
    expect(doc.info.release).to.be.a.string();
    expect(new Date(doc.info.release)).to.be.a.date();
    expect(doc.data).to.be.a.string().and.contain(["css"]);
  });

  test("getAllDocsForServing", () => {
    expect(docsForServing).to.be.an.object();

    const doc = docsForServing["en/test.html"];
    expect(doc).to.exist();
    expect(doc.lang).to.equal("en");
    expect(doc.edtion).to.be.null();
    expect(doc.info.title).to.equal("Manchester by the Sea");
    expect(doc.info.release).to.be.a.string();
    expect(new Date(doc.info.release)).to.be.a.date();
    expect(doc.data).to.be.a.string().and.not.contain(["css"]);
  });
});

// you have to export a lab script when running tests with lab
export { lab };
