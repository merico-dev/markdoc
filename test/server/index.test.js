import dotenv from "dotenv";
import { expect } from "@hapi/code";
import * as Lab from "@hapi/lab";

import { getAllDocsForServing } from "../../src/parser/main.js";
import { createServer, initServer } from "../../src/server/main.js";

const lab = Lab.script();
const { describe, before, after, it } = lab;

describe("Testing API", () => {
  let allDocs;
  let server;

  before({ timeout: 500 }, async () =>  {
    dotenv.config();
    allDocs = getAllDocsForServing();
    server = createServer();
    await initServer(server, allDocs);
  });

  after(async () => {
    await server.stop();
  });

  it("GET / should respond with 200 and have the right result", async () => {
    const res = await server.inject({
      method: "GET",
      url: "/"
    });
    expect(res.statusCode).to.equal(200);
    expect(res.result).to.be.a.string();
  });

  it("GET /version should respond with 404", async () => {
    const res = await server.inject({
      method: "GET",
      url: "/version"
    });
    expect(res.statusCode).to.equal(404);
  });
});

// you have to export a lab script when running tests with lab
export { lab };
