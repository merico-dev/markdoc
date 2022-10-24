import path from "path";
import { expect } from "@hapi/code";
import * as Lab from "@hapi/lab";

import {
  splitOnce,
  deriveFileVersionFromFileName,
  deriveFileLangFromFileDir,
} from "../src/misc.js";

const lab = Lab.script();
const { suite, test } = lab;

suite("Testing Misc", () => {
  const emptyPath1 = undefined;
  const emptyPath2 = "";
  const emptyPath3 = "zh/";
  const emptyPath4 = "zh/.md";

  const fullPath1 = "test.md";
  const fullPath2 = "zh/test.md";
  const fullPath3 = "zh/test@3.md";
  const fullPath4 = "zh/test@3@4.md";
  const fullPath5 = "zh/test@3.14.md";
  const fullPath6 = "zh/cn/test.md";
  const fullPath7 = "zh/cn@2/test@3.md";

  test("splitOnce", () => {
    let result = splitOnce(emptyPath1, "@");
    expect(result).to.be.an.array().and.to.have.length(1);
    expect(result[0]).to.equal(emptyPath1);

    result = splitOnce(emptyPath2, "@");
    expect(result).to.be.an.array().and.to.have.length(1);
    expect(result[0]).to.equal(emptyPath2);

    result = splitOnce(fullPath1);
    expect(result).to.be.an.array().and.to.have.length(1);
    expect(result[0]).to.equal(fullPath1);

    result = splitOnce(fullPath3, "@");
    expect(result).to.be.an.array().and.to.have.length(2);
    expect(result[0]).to.equal("zh/test");
    expect(result[1]).to.equal("3.md");

    result = splitOnce(fullPath4, "@");
    expect(result).to.be.an.array().and.to.have.length(2);
    expect(result[0]).to.equal("zh/test");
    expect(result[1]).to.equal("3@4.md");
  });

  test("deriveFileVersionFromFileName", () => {
    let { name: emptyName2 } = path.parse(emptyPath2);
    let result = deriveFileVersionFromFileName(emptyName2);
    expect(result).to.be.null();

    let { name: emptyName3 } = path.parse(emptyPath3);
    result = deriveFileVersionFromFileName(emptyName3);
    expect(result).to.be.null();

    let { name: emptyName4 } = path.parse(emptyPath4);
    result = deriveFileVersionFromFileName(emptyName4);
    expect(result).to.be.null();

    let { name: fullName2 } = path.parse(fullPath2);
    result = deriveFileVersionFromFileName(fullName2);
    expect(result).to.be.null();

    let { name: fullName3 } = path.parse(fullPath3);
    result = deriveFileVersionFromFileName(fullName3);
    expect(result).to.equal(3);

    let { name: fullName4 } = path.parse(fullPath4);
    result = deriveFileVersionFromFileName(fullName4);
    expect(result).to.be.null();

    let { name: fullName5 } = path.parse(fullPath5);
    result = deriveFileVersionFromFileName(fullName5);
    expect(result).to.be.null();

    let { name: fullName7 } = path.parse(fullPath7);
    result = deriveFileVersionFromFileName(fullName7);
    expect(result).to.equal(3);
  });

  test("deriveFileLangFromFileDir", () => {
    let { dir: emptyDir2 } = path.parse(emptyPath2);
    let result = deriveFileLangFromFileDir(emptyDir2);
    expect(result).to.be.null();

    let { dir: emptyDir3 } = path.parse(emptyPath3);
    result = deriveFileLangFromFileDir(emptyDir3);
    expect(result).to.be.null();

    let { dir: emptyDir4 } = path.parse(emptyPath4);
    result = deriveFileLangFromFileDir(emptyDir4);
    expect(result).to.equal("zh");

    let { dir: fullDir1 } = path.parse(fullPath1);
    result = deriveFileLangFromFileDir(fullDir1);
    expect(result).to.be.null();

    let { dir: fullDir2 } = path.parse(fullPath2);
    result = deriveFileLangFromFileDir(fullDir2);
    expect(result).to.equal("zh");

    let { dir: fullDir4 } = path.parse(fullPath4);
    result = deriveFileLangFromFileDir(fullDir4);
    expect(result).to.equal("zh");

    let { dir: fullDir5 } = path.parse(fullPath5);
    result = deriveFileLangFromFileDir(fullDir5);
    expect(result).to.equal("zh");

    let { dir: fullDir6 } = path.parse(fullPath6);
    result = deriveFileLangFromFileDir(fullDir6);
    expect(result).to.equal("zh");
  });
});

// you have to export a lab script when running tests with lab
export { lab };
