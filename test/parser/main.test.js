import dotenv from "dotenv";
import { expect } from "@hapi/code";
import * as Lab from "@hapi/lab";

import {
  getMarkdownManifest,
  isFileDirValid,
} from "../../src/misc.js";
import { getAllDocsForPublishing, getAllDocsForServing } from "../../src/parser/main.js";

const lab = Lab.script();
const { suite, test, before } = lab;

suite("Testing Parser", () => {
  let markdownSourceKey;
  let docsForPublishing;
  let docsForServing;

  before(() => {
    dotenv.config();
    const { manifestFilePath, manifest } = getMarkdownManifest(process.env.MARKDOWN_MANIFEST);
    if (Array.isArray(manifest) && manifest.length >= 1) {
      markdownSourceKey = manifest[0].key;
    }
    if (isFileDirValid(markdownSourceKey)) {
      docsForPublishing = getAllDocsForPublishing(manifestFilePath, manifest);
      docsForServing = getAllDocsForServing(manifestFilePath, manifest);
    }
  });

  test("markdown source should exist and have a valid key", () => {
    const isMarkdownSourceKeyValid = isFileDirValid(markdownSourceKey);
    expect(isMarkdownSourceKeyValid).to.be.a.boolean().and.to.equal(true);
  });

  test("getAllDocsForPublishing", () => {
    expect(docsForPublishing).to.be.an.array();
    expect(docsForPublishing.length).to.be.at.least(1);

    const doc = docsForPublishing.find(item => item.relativePath === `${markdownSourceKey}/en/test@3.html`);
    expect(doc).to.exist();
    expect(doc.source).to.equal(markdownSourceKey);
    expect(doc.lang).to.equal("en");
    expect(doc.edition).to.equal(3);
    expect(doc.info.title).to.equal("Manchester by the Sea V3");
    expect(doc.info.release).to.be.a.string();
    expect(new Date(doc.info.release)).to.be.a.date();
    expect(doc.data).to.be.a.string().and.contain(["css"]);
  });

  test("getAllDocsForServing", () => {
    expect(docsForServing).to.be.an.object();

    const doc = docsForServing[`${markdownSourceKey}/en/test.html`];
    expect(doc).to.exist();
    expect(doc.source).to.equal(markdownSourceKey);
    expect(doc.lang).to.equal("en");
    expect(doc.edition).to.be.null();
    expect(doc.info.title).to.equal("Manchester by the Sea");
    expect(doc.info.release).to.be.a.string();
    expect(new Date(doc.info.release)).to.be.a.date();
    expect(doc.data).to.be.a.string().and.not.contain(["css"]);
  });
});

// you have to export a lab script when running tests with lab
export { lab };
