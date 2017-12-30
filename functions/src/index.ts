import * as functions from "firebase-functions";
import * as actions from "actions-on-google";
import { purescript } from "./lib.purs";

// Start writing Firebase Functions
// https://firebase.google.com/functions/write-firebase-functions

export const helloWorld = functions.https.onRequest((request, response) => {
  const app = new actions.DialogflowApp({ request, response });
  const intent = app.getIntent() || Actions.UNKNOWN_INTENT;

  return Responses[intent]();
});

// Dialogflow actions
const Actions = {
  WELCOME: "input.welcome",
  REQUEST_NAME_PERMISSION: "request.name.permission",
  REQUEST_LOC_PERMISSION: "request.location.permission",
  UNHANDLED_DEEP_LINK: "error.deeplink",
  UNKNOWN_INTENT: "error.unknown_intent"
};

const Responses = {
  [Actions.UNKNOWN_INTENT]: () => {
    return ssml`<speak>
      Woops!
      <break time="500ms"/>
      Sorry about this, but I can't quite figure out what you meant.
      Can you say that again?
    </speak>`;
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
