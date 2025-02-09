const MODERN_ACTIVITY = 15;
const HALF_LIFE_PERIOD = 5730;

/**
 * Determine the age of archeological find by using
 * given MODERN_ACTIVITY and HALF_LIFE_PERIOD values
 * 
 * @param {String} sampleActivity string representation of current activity 
 * @return {Number | Boolean} calculated age in years or false
 * in case of incorrect sampleActivity
 *
 * @example
 * 
 * dateSample('1') => 22387
 * dateSample('WOOT!') => false
 *
 */
function dateSample(sampleActivity) {
  if (typeof sampleActivity !== "string") {
    return false;
  }

  const activity = parseFloat(sampleActivity);

  if (!activity || activity <= 0) {
    return false;
  }

  const halfTime = Math.LN2 / HALF_LIFE_PERIOD;
  const result = Math.ceil(Math.log(MODERN_ACTIVITY / activity) / halfTime);

  return result > 0 ? result : false;
}

module.exports = {
  dateSample
};
