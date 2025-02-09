const { ListNode } = require('../extensions/list-node.js');

/**
 * Implement the Queue with a given interface via linked list (use ListNode extension above).
 *
 * @example
 * const queue = new Queue();
 *
 * queue.enqueue(1); // adds the element to the queue
 * queue.enqueue(3); // adds the element to the queue
 * queue.dequeue(); // returns the top element from queue and deletes it, returns 1
 * queue.getUnderlyingList() // returns { value: 3, next: null }
 */
class Queue extends ListNode {
  constructor() {
    super(null);
  }

  getUnderlyingList() {
    return this;
  }

  enqueue(value) {
    if (value === null) {
      return;
    }

    const addValue = (node, value) => {
      if (node.value === null) {
        node.value = value;
      } else {
        if (node.next === null) {
          node.next = new ListNode(value);
        } else {
          addValue(node.next, value);
        }
      }
    }

    addValue(this, value);
  }

  dequeue() {
    if (this.value === null) {
      return;
    }

    const valueCopy = this.value;
    const nextCopy = this.next;

    this.value = nextCopy.value;
    this.next = nextCopy.next;

    return valueCopy;
  }
}

module.exports = {
  Queue
};
