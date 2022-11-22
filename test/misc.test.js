import path from "path";
import { expect } from "@hapi/code";
import * as Lab from "@hapi/lab";

import {
  splitOnce,
  deriveFileEditionFromFileName,
  deriveFileSourceAndLangFromFileDir,
} from "../src/misc.js";

const lab = Lab.script();
const { suite, test } = lab;

suite("Testing Misc", () => {
  const emptyPath1 = undefined;
  const emptyPath2 = "";
  const emptyPath3 = "zh/";
  const emptyPath4 = "zh/.md";
  const emptyPath5 = "tutorial/zh/";
  const emptyPath6 = "tutorial/zh/.md";

  const fullPath1 = "test.md";
  const fullPath2 = "tutorial/zh/test.md";
  const fullPath3 = "tutorial/zh/test@3.md";
  const fullPath4 = "tutorial/zh/test@3@4.md";
  const fullPath5 = "tutorial/zh/test@3.14.md";
  const fullPath6 = "tutorial/zh/cn/test.md";
  const fullPath7 = "tutorial/zh/cn@2/test@3.md";
  const fullPath8 = "tutorial/test.md";

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
    expect(result[0]).to.equal("tutorial/zh/test");
    expect(result[1]).to.equal("3.md");

    result = splitOnce(fullPath4, "@");
    expect(result).to.be.an.array().and.to.have.length(2);
    expect(result[0]).to.equal("tutorial/zh/test");
    expect(result[1]).to.equal("3@4.md");
  });

  test("deriveFileEditionFromFileName", () => {
    let { name: emptyName2 } = path.parse(emptyPath2);
    let result = deriveFileEditionFromFileName(emptyName2);
    expect(result).to.be.null();

    let { name: emptyName3 } = path.parse(emptyPath3);
    result = deriveFileEditionFromFileName(emptyName3);
    expect(result).to.be.null();

    let { name: emptyName4 } = path.parse(emptyPath4);
    result = deriveFileEditionFromFileName(emptyName4);
    expect(result).to.be.null();

    let { name: emptyName5 } = path.parse(emptyPath5);
    result = deriveFileEditionFromFileName(emptyName5);
    expect(result).to.be.null();

    let { name: fullName2 } = path.parse(fullPath2);
    result = deriveFileEditionFromFileName(fullName2);
    expect(result).to.be.null();

    let { name: fullName3 } = path.parse(fullPath3);
    result = deriveFileEditionFromFileName(fullName3);
    expect(result).to.equal(3);

    let { name: fullName4 } = path.parse(fullPath4);
    result = deriveFileEditionFromFileName(fullName4);
    expect(result).to.be.null();

    let { name: fullName5 } = path.parse(fullPath5);
    result = deriveFileEditionFromFileName(fullName5);
    expect(result).to.be.null();

    let { name: fullName7 } = path.parse(fullPath7);
    result = deriveFileEditionFromFileName(fullName7);
    expect(result).to.equal(3);

    let { name: fullName8 } = path.parse(fullPath8);
    result = deriveFileEditionFromFileName(fullName8);
    expect(result).to.be.null();
  });

  test("deriveFileSourceAndLangFromFileDir", () => {
    let { dir: emptyDir2 } = path.parse(emptyPath2);
    let result = deriveFileSourceAndLangFromFileDir(emptyDir2);
    expect(result).to.be.an.array().and.to.have.length(2);
    expect(result[0]).to.be.null();
    expect(result[1]).to.be.null();

    let { dir: emptyDir3 } = path.parse(emptyPath3);
    result = deriveFileSourceAndLangFromFileDir(emptyDir3);
    expect(result).to.be.an.array().and.to.have.length(2);
    expect(result[0]).to.be.null();
    expect(result[1]).to.be.null();

    let { dir: emptyDir4 } = path.parse(emptyPath4);
    result = deriveFileSourceAndLangFromFileDir(emptyDir4);
    expect(result).to.be.an.array().and.to.have.length(2);
    expect(result[0]).to.equal("zh");
    expect(result[1]).to.be.null();

    let { dir: emptyDir5 } = path.parse(emptyPath5);
    result = deriveFileSourceAndLangFromFileDir(emptyDir5);
    expect(result).to.be.an.array().and.to.have.length(2);
    expect(result[0]).to.equal("tutorial");
    expect(result[1]).to.be.null();

    let { dir: emptyDir6 } = path.parse(emptyPath6);
    result = deriveFileSourceAndLangFromFileDir(emptyDir6);
    expect(result).to.be.an.array().and.to.have.length(2);
    expect(result[0]).to.equal("tutorial");
    expect(result[1]).to.equal("zh");

    let { dir: fullDir1 } = path.parse(fullPath1);
    result = deriveFileSourceAndLangFromFileDir(fullDir1);
    expect(result).to.be.an.array().and.to.have.length(2);
    expect(result[0]).to.be.null();
    expect(result[1]).to.be.null();

    let { dir: fullDir2 } = path.parse(fullPath2);
    result = deriveFileSourceAndLangFromFileDir(fullDir2);
    expect(result).to.be.an.array().and.to.have.length(2);
    expect(result[0]).to.equal("tutorial");
    expect(result[1]).to.equal("zh");

    let { dir: fullDir4 } = path.parse(fullPath4);
    result = deriveFileSourceAndLangFromFileDir(fullDir4);
    expect(result).to.be.an.array().and.to.have.length(2);
    expect(result[0]).to.equal("tutorial");
    expect(result[1]).to.equal("zh");

    let { dir: fullDir5 } = path.parse(fullPath5);
    result = deriveFileSourceAndLangFromFileDir(fullDir5);
    expect(result).to.be.an.array().and.to.have.length(2);
    expect(result[0]).to.equal("tutorial");
    expect(result[1]).to.equal("zh");

    let { dir: fullDir6 } = path.parse(fullPath6);
    result = deriveFileSourceAndLangFromFileDir(fullDir6);
    expect(result).to.be.an.array().and.to.have.length(2);
    expect(result[0]).to.equal("tutorial");
    expect(result[1]).to.equal("zh");

    let { dir: fullDir8 } = path.parse(fullPath8);
    result = deriveFileSourceAndLangFromFileDir(fullDir8);
    expect(result).to.be.an.array().and.to.have.length(2);
    expect(result[0]).to.equal("tutorial");
    expect(result[1]).to.be.null();
  });
});

// you have to export a lab script when running tests with lab
export { lab };
