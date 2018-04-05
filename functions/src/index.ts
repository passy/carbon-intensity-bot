"use strict";

import * as functions from "firebase-functions";
import * as actions from "actions-on-google";
import * as maps from "@google/maps";
// @ts-ignore
import * as lib from "./lib.purs";
import { DialogflowApp } from "actions-on-google/dialogflow-app";

/**
 * For geocoding city + ZIP, I could do something like this:
 *
 * https://maps.googleapis.com/maps/api/geocode/json?components=country:gb|locality:London|post_code:WC1H%200PL&key=key
 * https://maps.googleapis.com/maps/api/geocode/json?components=locality:Altenholz|post_code:24161&key=key
 */

const coarseLocationToCoordinates = (mapsClient: any, postCode: string, city: string): Promise<{latitude: number, longitude: number}> => {
  return new Promise((resolve, reject) => mapsClient.geocode({
    components: {
      locality: city,
      post_code: postCode,
    }
  }, (e: Error, response: any) => {
    if (e) {
      return reject(e);
    }

      const { results } = response.json;
      const components = results[0].geometry;
      return resolve({ latitude: components.location.lat, longitude: components.location.lng});
  }));
};

/**
 * Gets the country code from results returned by Google Maps reverse geocoding from coordinates.
 * @param {object} mapsClient
 * @param {number} latitude
 * @param {number} longitude
 * @return {Promise<string>}
 */
const coordinatesToCountryCode = (mapsClient: any, latitude: number, longitude: number): Promise<string> => {
  const latlng = [latitude, longitude];
  return new Promise((resolve, reject) => mapsClient.reverseGeocode({ latlng },
    /**
     * @param {Error} e
     * @param {Object<string, *>} response
     */
    (e: Error, response: any) => {
      if (e) {
        return reject(e);
      }
      const { results } = response.json;
      /** @type {Array<Object<string, *>>} */
      const components = results[0].address_components;
      for (const component of components) {
        for (const type of component.types) {
          if (type === 'country') {
            return resolve(component.short_name);
          }
        }
      }
      reject(new Error('Could not parse country code from Google Maps results'));
    }
  ));
}

/**
 * Sanitize template literal inputs by escaping characters into XML entities to use in SSML
 * Also normalize the extra spacing for better text rendering in SSML
 * A tag function used by ES6 tagged template literals
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals
 *
 * @example
 * const equation = '"1 + 1 > 1"';
 * const response = ssml`
 *   <speak>
 *     ${equation}
 *   </speak>
 * `;
 * // Equivalent to ssml`\n  <speak>\n    ${equation}\n  </speak>\n`
 * console.log(response);
 * // Prints: '<speak>&quot;1 + 1 &gt; 1&quot;</speak>'
 *
 * @param {TemplateStringsArray} template Non sanitized constant strings in the template literal
 * @param {Array<string>} inputs Computed expressions to be sanitized surrounded by ${}
 */
const ssml = (
  template: TemplateStringsArray,
  ...inputs: Array<string>
): string =>
  template
    .reduce(
      (out, str, i) =>
        i
          ? out +
            inputs[i - 1]
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;") +
            str
          : str
    )
    .trim()
    .replace(/\s+/g, " ")
    .replace(/ </g, "<")
    .replace(/> /g, ">");

// Dialogflow actions
const Actions = {
  WELCOME: "input.welcome",
  REQUEST_LOC_PERMISSION: "request.location.permission",
  UNKNOWN_INTENT: "error.unknown_intent",
  READ_CARBON_INTENSITY: "carbon.read",
  UNHANDLED_DEEP_LINK: "error.deeplink",
};

const Responses = {
  welcome: () =>
    ssml`<speak>
      Hi, I'm Carbon Intensity bot. Would you like me to tell you your local carbon intensity or fossil fuel usage?
    </speak>`,
  errorUnknownIntent: () =>
    ssml`<speak>
      Woops!
      <break time="500ms"/>
      Sorry about this, but I can't quite figure out what you meant.
      Can you say that again?
    </speak>`,
  permissionReason: () =>
    'To find out your local electricity source',
  unsupportedRegion: () =>
    ssml`<speak>
      For your region we don't have reliable information at the moment.
      <break time="300ms" />
      Sorry about that!
    </speak>`,
  sayIntensity: (res: Co2Response) =>
    ssml`<speak>
      In your area, the electricity is generated
      using ${res.value0.fossilFuelPercentage.toFixed(1)}%
      fossil fuels leading to a carbon intensity of
      ${res.value0.carbonIntensity.toFixed(1)} ${res.value0.carbonIntensityUnit}.
    </speak>`,
};

declare interface Co2Data {
  readonly countryCode: string;
  readonly carbonIntensity: number;
  readonly fossilFuelPercentage: number;
  readonly carbonIntensityUnit: string;
}

declare interface UserStorage {
  countryCode: string;
}

declare interface Co2Response {
  readonly value0: Co2Data;
}

const respondWithCountryCode = (app: DialogflowApp, countryCode: String): any => {
  lib.requestCo2Country(functions.config().co2signal.key, countryCode)()
    .then((res: { value0: Co2Response }) => {
      return app.tell(Responses.sayIntensity(res.value0));
    }).catch(err => {
      // TODO: Share constant with Purs module
      if (err === "Incomplete response") {
        return app.tell(Responses.unsupportedRegion());
      } else {
        throw err;
      }
    });
};

const Flows = new Map([
  [Actions.UNKNOWN_INTENT, (app: DialogflowApp) => {
    return app.tell(Responses.errorUnknownIntent());
  }],
  [Actions.WELCOME, (app: DialogflowApp) => {
    return app.ask(Responses.welcome());
  }],
  [Actions.REQUEST_LOC_PERMISSION, (app: DialogflowApp) => {
    const permissions = app.SupportedPermissions;
    // If the request comes from a phone, we can't use coarse location.
    const requestedPermission = app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)
      ? permissions.DEVICE_PRECISE_LOCATION
      : permissions.DEVICE_COARSE_LOCATION;

    (app.data as any).requestedPermission = requestedPermission;
    const countryCode = (app.userStorage as UserStorage).countryCode;
    if (!countryCode) {
      return app.askForPermission(Responses.permissionReason(), requestedPermission as any);
    }

    return respondWithCountryCode(app, countryCode);
  }],
  [Actions.READ_CARBON_INTENSITY, (app: DialogflowApp) => {
    if (!app.isPermissionGranted()) {
      return Promise.reject(new Error('Permission not granted'));
    }

    const mapsClient = maps.createClient({
      key: functions.config().geocoding.key,
    });
    const requestedPermission = (app.data as any).requestedPermission;
    const permissions = app.SupportedPermissions;

    let coordinatesP;
    if (requestedPermission === permissions.DEVICE_COARSE_LOCATION) {
      // If we requested coarse location, it means that we're on a speaker device.
      const location = app.getDeviceLocation();
      coordinatesP = coarseLocationToCoordinates(mapsClient, location.zipCode, location.city);
    } else if (requestedPermission === permissions.DEVICE_PRECISE_LOCATION) {
      const { coordinates } = app.getDeviceLocation();
      coordinatesP = Promise.resolve(coordinates);
    } else {
      coordinatesP = Promise.reject(new Error('Unrecognized permission'));
    }

    return coordinatesP
       .then(coordinates => coordinatesToCountryCode(mapsClient, coordinates.latitude, coordinates.longitude))
        // Yes, this is as bad as it looks. Some magic object we can write to and is somehow persisted in the CLOUD.
        .then(countryCode => { (app.userStorage as UserStorage).countryCode = countryCode; return countryCode; })
        .then(respondWithCountryCode.bind(null, app));
  }],
  [Actions.UNHANDLED_DEEP_LINK, (app) =>
    app.tell(Responses.welcome())
  ]
]);

export const webhook = functions.https.onRequest((request, response) => {
  const app = new actions.DialogflowApp({ request, response });
  return app.handleRequestAsync(Flows as any);
});