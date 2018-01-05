import * as functions from "firebase-functions";
import * as actions from "actions-on-google";
import * as maps from "@google/maps";
import * as lib from "./lib.purs";

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
  UNHANDLED_DEEP_LINK: "error.deeplink",
  UNKNOWN_INTENT: "error.unknown_intent",
  READ_CARBON_INTENSITY: "carbon.read",
};

const Responses = {
  errorUnknownIntent: () => {
    return ssml`<speak>
      Woops!
      <break time="500ms"/>
      Sorry about this, but I can't quite figure out what you meant.
      Can you say that again?
    </speak>`;
  },
  permissionReason: () => {
    return 'To find out your local electricity source'
  },
  sayIntensity: (res: Co2Response) => {
    return ssml`<speak>
      The current fossil fuel percentage of the energy generated is ${res.fossilFuelPercentage.toString()}.
    </speak>`;
  }
};


declare interface Co2Response {
  readonly countryCode: string;
  readonly carbonIntensity: number;
  readonly fossilFuelPercentage: number;
}

const Flows = new Map([
  [Actions.UNKNOWN_INTENT, (app) => {
    return app.tell(Responses.errorUnknownIntent());
  }],
  [Actions.REQUEST_LOC_PERMISSION, (app) => {
    const permissions = app.SupportedPermissions;
    // If the request comes from a phone, we can't use coarse location.
    const requestedPermission = app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)
      ? permissions.DEVICE_PRECISE_LOCATION
      : permissions.DEVICE_COARSE_LOCATION;

    app.data.requestedPermission = requestedPermission;
    if (!app.userStorage.location) {
      return app.askForPermission(Responses.permissionReason(), requestedPermission);
    }
  }],
  [Actions.READ_CARBON_INTENSITY, (app) => {
    if (!app.isPermissionGranted()) {
      return Promise.reject(new Error('Permission not granted'));
    }
    const requestedPermission = app.data.requestedPermission;
    const permissions = app.SupportedPermissions;
    if (requestedPermission === permissions.DEVICE_COARSE_LOCATION) {
      // If we requested coarse location, it means that we're on a speaker device.
      app.userStorage.location = app.getDeviceLocation().city;
    }
    if (requestedPermission === permissions.DEVICE_PRECISE_LOCATION) {
      const { coordinates } = app.getDeviceLocation();
      console.log('COORDINATES: ', coordinates);
      return lib.requestCo2LatLon('xxx', coordinates.latitude, coordinates.longitude)
        .then((res: Co2Response) => {
          return app.tell(Responses.sayIntensity(res));
        });
    }
    return Promise.reject(new Error('Unrecognized permission'));
  }],
]);


export const webhook = functions.https.onRequest((request, response) => {
  const app = new actions.DialogflowApp({ request, response });
  app.handleRequest(Flows);
});
