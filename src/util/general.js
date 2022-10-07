export function getSentence(s) {
  return getWords(s).join(" ");
}
export function getWords(s) {
  return window.jQuery
    .trim(s)
    .split(/\s+|\r?\n/g)
    .filter((tok) => tok.length);
}
export function countWords(s) {
  return getWords(s).length;
}
export function countChars(s) {
  const words = getWords(s);
  return words.reduce(
    (t, c) => t + c.length,
    words.length ? words.length - 1 : 0
  );
}

export function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}
export function makeEnum(arr) {
  let obj = {};
  for (let val of arr) {
    obj[val] = val; //Symbol(val);
  }
  return Object.freeze(obj);
}
export function isValidUrl(urlString) {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
}
