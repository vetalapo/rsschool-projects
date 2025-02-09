/**
 * Calculate turns number and time (in seconds) required
 * to solve puzzle
 * 
 * @param {Number} disks number of disks
 * @param {Number} turnsSpeed speed (in turns/hour)
 * @return {Object} object with props turns (number of turns)
 * and seconds (time in seconds)
 *
 * @example
 * 
 * calculateHanoi(9, 4308) => { turns: 511, seconds: 427 }
 *
 */
function calculateHanoi(disksNumber, turnsSpeed) {
  const resultTurns = Math.pow(2, disksNumber) - 1;
  const resultSeconds = Math.floor((1 / (turnsSpeed / 3600)) *  resultTurns);
  
  return {
    turns: resultTurns,
    seconds: resultSeconds
  }
}

module.exports = {
  calculateHanoi
};
