import * as triggers from "../lib/index.js";
import * as fs from "fs";
import * as path from "path";
import * as XHR from "xhr2";
import {
  MockRequest,
  headerV2
} from "actions-on-google/test/utils/mocking";
import * as functions from "firebase-functions";

class MockResponse {
  statusCode: number;
  headers: Map<string, string>;
  body: string;
  resolve: Function;

  constructor (resolve: Function) {
    this.statusCode = 200;
    this.headers = new Map();
    this.resolve = resolve;
  }

  status (statusCode: number) {
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
// @ts-ignore
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

  return new Promise<MockResponse>((resolve, reject) => {
    const resp = new MockResponse(resolve);
    triggers.webhook(req, resp);
    return resp;
  }).then((resp: MockResponse) => {
    expect(resp.statusCode).toBe(200);
    expect((resp.body as any).speech).toMatch(/\<speak\>In your area, the electricity is generated using \d+\.\d% fossil fuels leading to a carbon intensity of \d+\.\d+ gCO2eq\/kWh\.\<\/speak\>/);
  })
});
