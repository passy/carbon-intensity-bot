import * as triggers from "../lib/index.js";
import * as fs from "fs";
import * as path from "path";
import {
  MockRequest,
  MockResponse,
  headerV2
} from "actions-on-google/test/utils/mocking";
import * as functions from "firebase-functions";

// Manually mock that static global.
functions.config = () => {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", ".runtimeconfig.json"), {
      encoding: "utf-8"
    })
  );
};

const loadFixture = name => {
  const body = JSON.parse(
    fs.readFileSync(path.join(__dirname, "requests", name + ".json"), {
      encoding: "utf-8"
    })
  );
  return new MockRequest(headerV2, body);
};

it("sends a response", () => {
  expect.assertions(1);
  const req = loadFixture("carbon_zip");

  const resp = new MockResponse();
  triggers.webhook(req, resp);

  expect(resp.statusCode).toBe(200);
  expect(resp.body).toBe("hello world");
});
