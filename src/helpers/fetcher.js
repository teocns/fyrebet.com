import constants from "../constants/Environment";
import sessionStore from "../store/session";
import * as sessionActions from "../actions/session";
import Errors from "../constants/errors";
String.prototype.trimChar = function (charToRemove) {
  let string = this;
  while (string.charAt(0) == charToRemove) {
    string = string.substring(1);
  }

  while (string.charAt(string.length - 1) == charToRemove) {
    string = string.substring(0, string.length - 1);
  }

  return string;
};

// The class will automatically handle errors (notifies genericAppErrorHanelr)
export default class Fetcher {
  static _req(method, endpoint, data) {
    endpoint = `${constants.ENDPOINT.trimChar("/")}/${endpoint.trimChar("/")}`;

    const headers = { "Content-Type": "application/json" };
    // If authentication token, append it
    const authentication_token = sessionStore.getAuthenticationToken();

    if (authentication_token) {
      headers["X-Authentication-Token"] = authentication_token;
    }
    return new Promise((resolve) => {
      let requestOptions = {
        method: method,
        headers,
        credentials: "include",
      };
      if (method === "POST") {
        requestOptions.body = JSON.stringify(data);
      } else {
        endpoint = `${endpoint}?${new URLSearchParams(data).toString()}`;
      }
      fetch(endpoint, requestOptions).then((response) => {
        response.json().then((json) => {
          try {
            if (json.error) {
              sessionActions.onApiError(json.error);
            }
            resolve(json);
          } catch (error) {
            sessionActions.onApiError(Errors.ERR_UNKNOWN);
            resolve(false);
          }
        });
      });
    });
  }
  static post(endpoint, data) {
    // Adjust endpoint
    return this._req("POST", endpoint, data);
  }
  static get(endpoint, data) {
    return this._req("GET", endpoint, data);
  }
}
