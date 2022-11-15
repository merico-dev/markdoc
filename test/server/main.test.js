import dotenv from "dotenv";
import { expect } from "@hapi/code";
import * as Lab from "@hapi/lab";

import { getAllDocsForServing } from "../../src/parser/main.js";
import { createServer, initServer } from "../../src/server/main.js";

const lab = Lab.script();
const { describe, it, before, after } = lab;

describe("Testing Server", () => {
  let allDocs;
  let server;

  before({ timeout: 1000 }, async () => {
    dotenv.config();
    allDocs = getAllDocsForServing();
    server = createServer(process.env.TEST_SERVER_HOST, process.env.TEST_SERVER_PORT);
    await initServer(server, allDocs);
  });

  after(async () => {
    await server.stop();
  });

  it("GET /", async () => {
    const res = await server.inject({
      method: "GET",
      url: "/"
    });
    expect(res.statusCode).to.equal(200);
    expect(res.result).to.be.a.string();
  });

  it("GET /api/v1/version", async () => {
    const res = await server.inject({
      method: "GET",
      url: "/api/v1/version"
    });
    expect(res.statusCode).to.equal(200);
    expect(res.result.buildVersion).to.equal(process.env.BUILD_VERSION);
    expect(res.result.packageVersion).to.be.a.string();
  });

  it("POST /api/v1/docs", async () => {
    const res1 = await server.inject({
      method: "POST",
      url: "/api/v1/docs",
      payload: [{
        "key": "not-exist",
        "lang": "en"
      }]
    });
    expect(res1.statusCode).to.equal(200);
    expect(res1.result).to.be.an.array().and.to.have.length(1);
    expect(res1.result[0]).to.be.null();

    const res2 = await server.inject({
      method: "POST",
      url: "/api/v1/docs",
      payload: [{
        "key": "test",
        "lang": "en"
      }]
    });
    expect(res2.statusCode).to.equal(200);
    expect(res2.result).to.be.an.array().and.to.have.length(1);

    const res3 = await server.inject({
      method: "POST",
      url: "/api/v1/docs",
      payload: [{
        "key": "test",
        "lang": "en",
        "edtion": 2
      }]
    });
    expect(res3.statusCode).to.equal(200);
    expect(res3.result).to.be.an.array().and.to.have.length(1);
    expect(res3.result[0]).to.be.null();

    const res4 = await server.inject({
      method: "POST",
      url: "/api/v1/docs",
      payload: [{
        "key": "test",
        "lang": "en",
        "edtion": "3"
      }]
    });
    expect(res4.statusCode).to.equal(200);
    expect(res4.result).to.be.an.array().and.to.have.length(1);
    expect(res4.result[0]).to.be.null();

    const res5 = await server.inject({
      method: "POST",
      url: "/api/v1/docs",
      payload: [{
        "key": "test",
        "lang": "en",
        "edtion": 3
      }]
    });
    expect(res5.statusCode).to.equal(200);
    expect(res5.result).to.be.an.array().and.to.have.length(1);
    expect(res5.result[0].edtion).to.equal(3);

    const res6 = await server.inject({
      method: "POST",
      url: "/api/v1/docs",
      payload: [{
        "key": "test",
        "lang": "en",
        "sections": [
          "not-exist"
        ]
      }]
    });
    expect(res6.statusCode).to.equal(200);
    expect(res6.result).to.be.an.array().and.to.have.length(1);
    expect(res6.result[0].data).to.be.an.array().and.to.have.length(1);
    expect(res6.result[0].data[0]).to.be.null();

    const res7 = await server.inject({
      method: "POST",
      url: "/api/v1/docs",
      payload: [{
        "key": "test",
        "lang": "en",
        "sections": [
          "awards"
        ]
      }]
    });
    expect(res7.statusCode).to.equal(200);
    expect(res7.result).to.be.an.array().and.to.have.length(1);
    expect(res7.result[0].edtion).to.be.null();
    expect(res7.result[0].data).to.be.an.array().and.to.have.length(1);
    expect(res7.result[0].data[0]).to.exist();

    const res8 = await server.inject({
      method: "POST",
      url: "/api/v1/docs",
      payload: [{
        "key": "test",
        "lang": "ja"
      }, {
        "key": "test",
        "lang": "en",
        "sections": [
          "awards"
        ]
      }]
    });
    expect(res8.statusCode).to.equal(200);
    expect(res8.result).to.be.an.array().and.to.have.length(2);
    expect(res8.result[0]).to.be.null();
    expect(res8.result[1]).to.exist();
  });
});

// you have to export a lab script when running tests with lab
export { lab };
