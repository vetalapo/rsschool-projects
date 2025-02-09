/**
 * Given a string, return its encoding version.
 *
 * @param {String} str
 * @return {String}
 *
 * @example
 * For aabbbc should return 2a3bc
 *
 */
function encodeLine(str) {
  let result = "";

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    let count = 0;

    while (str[i] === char) {
      count++;
      i++;
    }

    i--;
    result = `${result}${count <= 1 ? "" : count}${char}`;
  }

  return result;
}

module.exports = {
  encodeLine
};
