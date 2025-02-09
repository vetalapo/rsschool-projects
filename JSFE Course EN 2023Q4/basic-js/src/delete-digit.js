/**
 * Given some integer, find the maximal number you can obtain
 * by deleting exactly one digit of the given number.
 *
 * @param {Number} n
 * @return {Number}
 *
 * @example
 * For n = 152, the output should be 52
 *
 */
function deleteDigit(n) {
  let numDigits = [];

  while (n > 0) {
    const currNum = n % 10;
    numDigits.push(currNum);
    n = Math.trunc(n / 10);
  }

  let resultNums = [];

  for (let i = numDigits.length - 1; i >= 0; i--) {
    let subResult = 0;

    for (let j = numDigits.length - 1; j >= 0; j--) {
      if (i != j) {
        subResult = subResult * 10 + numDigits[j];
      }
    }

    resultNums.push(subResult);
  }

  return Math.max(...resultNums);
}

module.exports = {
  deleteDigit
};
