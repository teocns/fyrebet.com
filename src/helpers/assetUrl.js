import EnvironmentConstants from "../constants/Environment";

// Renders full URL if it contains a domain, otherwise adds our environment base URL
export default function assetUrl(resource) {
  if (
    new RegExp(
      "[a-zA-Z0-9]+://([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?"
    ).test(resource)
  ) {
    return resource;
  }
  return `${EnvironmentConstants.BASE_URL}${resource}`;
}
