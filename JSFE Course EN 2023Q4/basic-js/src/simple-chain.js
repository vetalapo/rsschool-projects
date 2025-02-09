/**
 * Implement chainMaker object according to task description
 * 
 */
const chainMaker = {
  values: [],
  getLength() {
    return this.values.length;
  },
  addLink(value) {
    this.values.push(`( ${String(value) || ''} )`);
    return this;
  },
  removeLink(position) {
    if (!Number.isInteger(position) || position < 1 || position > this.values.length) {
      this.values = [];
      throw new Error("You can't remove incorrect link!");
    }

    this.values.splice(position - 1, 1);

    return this;
  },
  reverseChain() {
    this.values.reverse();

    return this;
  },
  finishChain() {
    const chainCopy = this.values;
    this.values = [];

    return chainCopy.join("~~");
  }
};

module.exports = {
  chainMaker
};
