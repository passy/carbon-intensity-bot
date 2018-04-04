import * as lib from "../lib/index";
import * as fs from "fs";
import * as path from "path";

it('parses my partial JSON', () => {
  expect.assertions(2);

  const r = lib.decodeCo2Response("{}");
  expect(r).toBeNull();
});
