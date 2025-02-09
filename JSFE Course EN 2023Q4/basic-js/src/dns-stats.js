/**
 * Given an array of domains, return the object with the appearances of the DNS.
 *
 * @param {Array} domains
 * @return {Object}
 *
 * @example
 * domains = [
 *  'code.yandex.ru',
 *  'music.yandex.ru',
 *  'yandex.ru'
 * ]
 *
 * The result should be the following:
 * {
 *   '.ru': 3,
 *   '.ru.yandex': 3,
 *   '.ru.yandex.code': 1,
 *   '.ru.yandex.music': 1,
 * }
 *
 */
function getDNSStats(domains) {
  const dnsCount = {};
  
  for (let i = 0; i < domains.length; i++) {
    const parts = domains[i].split('.');

    let partitionKey = "";

    for (let j = parts.length - 1; j >= 0; j--) {
      partitionKey = `${partitionKey}.${parts[j]}`;

      if (dnsCount[partitionKey]) {
        dnsCount[partitionKey]++;
      } else {
        dnsCount[partitionKey] = 1;
      }
    }
  }

  return dnsCount;
}

module.exports = {
  getDNSStats
};
