import * as functions from "firebase-functions";
import * as actions from "actions-on-google";
import { purescript } from "./lib.purs";

// Start writing Firebase Functions
// https://firebase.google.com/functions/write-firebase-functions

export const helloWorld = functions.https.onRequest((request, response) => {
  const app = new actions.DialogflowApp({ request, response });
  return app.handleRequest(Flows);
});

// Dialogflow actions
const Actions = {
  WELCOME: "input.welcome",
  REQUEST_LOC_PERMISSION: "request.location.permission",
  UNHANDLED_DEEP_LINK: "error.deeplink",
  UNKNOWN_INTENT: "error.unknown_intent",
  READ_CARBON_INTENSITY: "carbon.read",
};

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
    // const requestedPermission = app.data.requestedPermission;
    // const permissions = app.SupportedPermissions;
    // if (requestedPermission === permissions.DEVICE_COARSE_LOCATION) {
    //   // If we requested coarse location, it means that we're on a speaker device.
    //   app.userStorage.location = app.getDeviceLocation().city;
    //   showLocationOnScreen();
    // }
    // if (requestedPermission === permissions.DEVICE_PRECISE_LOCATION) {
    //   // If we requested precise location, it means that we're on a phone.
    //   // Because we will get only latitude and longitude, we need to reverse geocode
    //   // to get the city.
    //   const { coordinates } = app.getDeviceLocation();
    //   return coordinatesToCity(coordinates.latitude, coordinates.longitude)
    //     .then(city => {
    //       app.userStorage.location = city;
    //       showLocationOnScreen();
    //     });
    // }
    return Promise.reject(new Error('Unrecognized permission'));
  }],
]);

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
  }
};

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
