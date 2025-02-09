/**
 * In the popular Minesweeper game you have a board with some mines and those cells
 * that don't contain a mine have a number in it that indicates the total number of mines
 * in the neighboring cells. Starting off with some arrangement of mines
 * we want to create a Minesweeper game setup.
 *
 * @param {Array<Array>} matrix
 * @return {Array<Array>}
 *
 * @example
 * matrix = [
 *  [true, false, false],
 *  [false, true, false],
 *  [false, false, false]
 * ]
 *
 * The result should be following:
 * [
 *  [1, 2, 1],
 *  [2, 1, 1],
 *  [1, 1, 1]
 * ]
 */
function minesweeper(matrix) {
  const result = new Array(matrix.length).fill()
      .map(_ => new Array(matrix[0].length).fill(0));

  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      result[row][col] = countAround(matrix, row, col);
    }
  }

  return result;
}

function countAround(matrix, inputRow, inputCol) {
  let count = 0;

  for (let row = inputRow - 1; row <= inputRow + 1; row++) {
    if (row < 0 || row >= matrix.length) {
      continue;
    }

    for (let col = inputCol - 1; col <= inputCol + 1; col++) {
      if (col < 0 || col >= matrix[row].length || (row === inputRow && col === inputCol)) {
        continue;
      }

      count += Number(matrix[row][col]);
    }
  }

  return count;
}

module.exports = {
  minesweeper
};
