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
export default setCookie;
