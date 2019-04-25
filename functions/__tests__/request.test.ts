import * as firebaseFunctionsTest from "firebase-functions-test";
import * as fs from "fs";
import * as path from "path";
import { nockSetups } from "./nock-setups";

const test = firebaseFunctionsTest();

// Apparently needs to happen after the side effects from the previous
// invocation have occured.
import * as triggers from "../lib/index";

class MockResponse {
  public statusCode: number;
  public headers: Map<string, string>;
  public body: any;
  public resolve: Function;

  constructor(resolve: Function) {
    this.statusCode = 200;
    this.headers = new Map();
    this.resolve = resolve;
    this.body = {};
  }

  public status(statusCode: number) {
    this.statusCode = statusCode;
    return this;
  }

  public send(body: object) {
    this.body = body;
    this.resolve(this);
    return this;
  }

  public setHeader(key, value) {
    this.headers[key] = value;
  }

  public append(header, value) {
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
    co2signal: {
      key: "012345",
    },
    geocoding: {
      // The 'AIza' prefix is validated on the client-side.
      key: "AIzaAABBCC",
    },
  });
}

const loadFixture = (name: string) => {
  const body = JSON.parse(
    fs.readFileSync(path.join(__dirname, "requests", name + ".json"), {
      encoding: "utf-8",
    }),
  );
  return {
    body,
    // tslint-ignore
    get: () => {},
    headers: {},
  };
};

["carbon_zip", "carbon_latlon", "carbon_userstorage"].forEach((fixture) => {
  it(`produces a response for fixture ${fixture}`, async () => {
    expect.assertions(2);
    nockSetups[fixture]();
    const req = loadFixture(fixture);

    const resp1 = await new Promise<MockResponse>((resolve, reject) => {
      const resp = new MockResponse(resolve);
      triggers.webhook(req, resp);
      return resp;
    });
    expect(resp1.statusCode).toBe(200);
    expect(resp1.body.payload.google.richResponse.items[0].simpleResponse.textToSpeech)
      .toMatch(/\<speak\>In your area, the electricity is generated using \d+\.\d% fossil fuels leading to a carbon intensity of \d+\.\d+ gCO2eq\/kWh\.\<\/speak\>/);
  });
});
