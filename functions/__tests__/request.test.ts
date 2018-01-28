import * as triggers from "../lib/index.js";
import * as fs from "fs";
import * as path from "path";
import * as request from "supertest";
import * as XHR from "xhr2";
import {
  MockRequest,
  headerV2
} from "actions-on-google/test/utils/mocking";
import * as functions from "firebase-functions";

class MockResponse {
  statusCode: number;
  headers: Map<string, string>;
  resolve: Function;

  constructor (resolve: Function) {
    this.statusCode = 200;
    this.headers = {};
    this.resolve = resolve;
  }

  status (statusCode) {
    this.statusCode = statusCode;
    return this;
  }

  send (body) {
    this.body = body;
    this.resolve(this);
    return this;
  }

  append (header, value) {
    this.headers[header] = value;
    return this;
  }
};

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
  // TODO: Figure out why this is necessary.
  new XHR();
  expect.assertions(2);
  const req = loadFixture("carbon_zip");

  return new Promise((resolve, reject) => {
    const resp = new MockResponse(resolve);
    triggers.webhook(req, resp);
  }).then((resp) => {
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toBe("hello world");
  })
});
