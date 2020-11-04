function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export const reverseObject = (o) =>
  Object.keys(o).reduce(
    (r, k) => Object.assign(r, { [o[k]]: (r[o[k]] || []).concat(k) }),
    {}
  );

export function trimChar(string, charToRemove) {
  while (string.charAt(0) == charToRemove) {
    string = string.substring(1);
  }

  while (string.charAt(string.length - 1) == charToRemove) {
    string = string.substring(0, string.length - 1);
  }

  return string;
}

export function trimLeft(string, charToRemove) {
  while (string.charAt(0) == charToRemove) {
    string = string.substring(1);
  }

  return string;
}

export function trimRight(string, charToRemove) {
  while (string.charAt(string.length - 1) == charToRemove) {
    string = string.substring(0, string.length - 1);
  }

  return string;
}

export default setCookie;
