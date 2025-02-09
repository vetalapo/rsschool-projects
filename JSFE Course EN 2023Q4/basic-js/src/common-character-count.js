/**
 * Given two strings, find the number of common characters between them.
 *
 * @param {String} s1
 * @param {String} s2
 * @return {Number}
 *
 * @example
 * For s1 = "aabcc" and s2 = "adcaa", the output should be 3
 * Strings have 3 common characters - 2 "a"s and 1 "c".
 */
function getCommonCharacterCount(s1, s2) {
  if (s1.length > s2.length) {
    return getCommonCharacterCount(s2, s1);
  }

  const s2CountMap = new Map();

  for (let i = 0; i < s2.length; i++) {
    const char = s2[i];

    if (!s2CountMap.has(char)) {
      s2CountMap.set(char, 0);
    }

    const currentMapValue = s2CountMap.get(char);
    s2CountMap.set(char, currentMapValue + 1);
  }

  let count = 0;

  for (let i = 0; i < s1.length; i++) {
    const char = s1[i];

    if (!s2CountMap.has(char)) {
      continue;
    }

    const currentMapValue = s2CountMap.get(char);

    if (currentMapValue <= 0) {
      continue;
    }

    s2CountMap.set(char, currentMapValue - 1);
    count++;
  }

  return count;
}

module.exports = {
  getCommonCharacterCount
};
