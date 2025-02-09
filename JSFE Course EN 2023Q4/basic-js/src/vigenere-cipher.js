/**
 * Implement class VigenereCipheringMachine that allows us to create
 * direct and reverse ciphering machines according to task description
 * 
 * @example
 * 
 * const directMachine = new VigenereCipheringMachine();
 * 
 * const reverseMachine = new VigenereCipheringMachine(false);
 * 
 * directMachine.encrypt('attack at dawn!', 'alphonse') => 'AEIHQX SX DLLU!'
 * 
 * directMachine.decrypt('AEIHQX SX DLLU!', 'alphonse') => 'ATTACK AT DAWN!'
 * 
 * reverseMachine.encrypt('attack at dawn!', 'alphonse') => '!ULLD XS XQHIEA'
 * 
 * reverseMachine.decrypt('AEIHQX SX DLLU!', 'alphonse') => '!NWAD TA KCATTA'
 * 
 */
class VigenereCipheringMachine {
  #isReverse;
  #aCode = 'A'.charCodeAt();
  #zCode = 'Z'.charCodeAt();

  constructor(mode) {
    this.#isReverse = mode === false;
  }

  encrypt(message, key) {
    return this.#process(message, key, this.#encryptStrategy.bind(this));
  }
  
  decrypt(encryptedMessage, key) {
    return this.#process(encryptedMessage, key, this.#decryptStrategy.bind(this));
  }

  #process(message, key, strategyFunc) {
    this.#throwErrorOnEmptyArgs(message, key);

    const upperMessage = message.toUpperCase();
    const keyDistances = key.toUpperCase().split('').map((c) => c.charCodeAt() - this.#aCode);

    const result = new Array(upperMessage.length);

    for (let i = 0, d = 0; i < upperMessage.length; i++) {
      const c = upperMessage[i];
      const cCode = c.charCodeAt();

      if (cCode < this.#aCode || cCode > this.#zCode ) {
        result[i] = c;
        continue;
      }

      const distance = keyDistances[d];

      result[i] = strategyFunc(cCode, distance);

      d++;

      if (d >= keyDistances.length) {
        d = 0;
      }
    }

    if (this.#isReverse) {
      result.reverse();
    }

    return result.join('');
  }

  #encryptStrategy(charCode, distance) {
    const nextPosition = charCode + distance;

    return String.fromCharCode(
      nextPosition <= this.#zCode
        ? nextPosition
        : this.#aCode + nextPosition - this.#zCode - 1
    );
  }

  #decryptStrategy(charCode, distance) {
    const priorPosition = charCode - distance;

    return String.fromCharCode(
      priorPosition >= this.#aCode
        ? priorPosition
        : this.#zCode - (this.#aCode - priorPosition) + 1
    );
  }

  #throwErrorOnEmptyArgs(a, b) {
    if (!a || !b) {
      throw new Error("Incorrect arguments!");
    }
  }
}

module.exports = {
  VigenereCipheringMachine
};
