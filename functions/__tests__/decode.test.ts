import * as lib from "../output/Lib";
import * as Either from "../output/Data.Either";
import * as fs from "fs";
import * as path from "path";

it('parses a partial JSON response', () => {
  const r = lib.decodeCo2Response(JSON.parse('{"_disclaimer":"This data is the exclusive property of Tomorrow and/or related parties. If you\'re in doubt about your rights to use this data, please contact hello@tmrow.com","status":"ok","countryCode":"US","data":{"fossilFuelPercentage":null},"units":{"carbonIntensity":"gCO2eq/kWh"}}'));
  expect(r).toEqual({value0: "Incomplete response"});
});

it('parses a full JSON response', () => {
  const r = lib.decodeCo2Response(JSON.parse('{"_disclaimer":"This data is the exclusive property of Tomorrow and/or related parties. If you\'re in doubt about your rights to use this data, please contact hello@tmrow.com","status":"ok","countryCode":"GB","data":{"carbonIntensity":273.4587121483331,"fossilFuelPercentage":48.78024921423173},"units":{"carbonIntensity":"gCO2eq/kWh"}}'));
  expect(r).toEqual(Either.Right.create({"value0": {"carbonData": {"value0": {"carbonIntensity": 273.4587121483331, "fossilFuelPercentage": 48.78024921423173}}, "carbonIntensityUnit": "gCO2eq/kWh", "countryCode": "GB"}}));
  expect(r).toBeInstanceOf(Either.Right);
  // We can't get this exported.
  expect(r.value0.constructor.name).toEqual("Co2Response");
});