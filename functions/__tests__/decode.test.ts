import * as lib from "../lib/index";
import * as fs from "fs";
import * as path from "path";

it('parses my partial JSON', () => {
  const r = lib.decodeCo2Response(JSON.parse('{"_disclaimer":"This data is the exclusive property of Tomorrow and/or related parties. If you\'re in doubt about your rights to use this data, please contact hello@tmrow.com","status":"ok","countryCode":"US","data":{"fossilFuelPercentage":null},"units":{"carbonIntensity":"gCO2eq/kWh"}}'));
  expect(r).not.toBeNull();
});
