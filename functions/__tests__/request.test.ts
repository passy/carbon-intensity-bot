import * as fs from "fs";
import * as path from "path";
import * as functions from "firebase-functions";
import * as firebaseFunctionsTest from "firebase-functions-test";
import { nockSetups } from "./nock-setups";

const test = firebaseFunctionsTest();

// Apparently needs to happen after the side effects from the previous
// invocation have occured.
import * as triggers from "../lib/index";

class MockResponse {
  statusCode: number;
  headers: Map<string, string>;
  body: string;
  resolve: Function;

  constructor(resolve: Function) {
    this.statusCode = 200;
    this.headers = new Map();
    this.resolve = resolve;
    this.body = "";
  }

  status(statusCode: number) {
    this.statusCode = statusCode;
    return this;
  }

  send(body) {
    this.body = body;
    this.resolve(this);
    return this;
  }

  append(header, value) {
    this.headers[header] = value;
    return this;
  }
}

const USE_REAL_CONFIG = false;

if (USE_REAL_CONFIG) {
  test.mockConfig(JSON.parse(fs.readFileSync(
    path.join(__dirname, "..", ".runtimeconfig.json"), {encoding: "utf-8"})));
} else {
  test.mockConfig({
    "geocoding": {
      // The 'AIza' prefix is validated on the client-side.
      "key": "AIzaAABBCC"
    },
    "co2signal": {
      "key": "012345"
    }
  });
}

const loadFixture = (name: string) => {
  const body = JSON.parse(
    fs.readFileSync(path.join(__dirname, "requests", name + ".json"), {
      encoding: "utf-8"
    })
  );
  return {
    get: function() {},
    body: body,
  };
};

["carbon_zip", "carbon_latlon", "carbon_userstorage"].forEach(fixture => {
  it(`produces a response for fixture ${fixture}`, () => {
    expect.assertions(2);
    nockSetups[fixture]();
    const req = loadFixture(fixture);

    return new Promise<MockResponse>((resolve, reject) => {
      const resp = new MockResponse(resolve);
      triggers.webhook(req, resp);
      return resp;
    }).then((resp: MockResponse) => {
      expect(resp.statusCode).toBe(200);
      expect((resp.body as any).speech).toMatch(
        /\<speak\>In your area, the electricity is generated using \d+\.\d% fossil fuels leading to a carbon intensity of \d+\.\d+ gCO2eq\/kWh\.\<\/speak\>/
      );
    });
  });
});
