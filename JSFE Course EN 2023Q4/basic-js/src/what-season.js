const util = require('util');

/**
 * Extract season from given date and expose the enemy scout!
 * 
 * @param {Date | FakeDate} date real or fake date
 * @returns {String} time of the year
 * 
 * @example
 * 
 * getSeason(new Date(2020, 02, 31)) => 'spring'
 * 
 */
function getSeason(date) {
  if (date === undefined) {
    return "Unable to determine the time of year!";
  }

  if (!isValidDate(date)) {
    throw new Error("Invalid date!");
  }

  const seasons = ["winter", "spring", "summer", "fall"];
  const seasonIndex = Math.trunc((date.getMonth() + 1) / 3) % 4;

  return seasons[seasonIndex];
}

function isValidDate(date) {  
  return util.types.isDate(date);
}

module.exports = {
  getSeason
};
