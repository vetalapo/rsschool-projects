const { Node } = require('../extensions/list-tree.js');

class BinarySearchTree extends Node {
  constructor() {
    super(null);
  }

  root() {
    if (this.data === null) {
        return null;
    }

    return this;
  }

  add(data) {
    if (data === null) {
      return;
    }

    const addNodeData = (node, data) => {
      if (!node.data) {
        node.data = data;
        return;
      }

      if (data === node.data) {
        return;
      }

      if (data > node.data) {
        if (node.right) {
          addNodeData(node.right, data);
        } else {
          node.right = new Node(data);
        }
      } else {
        if (node.left) {
          addNodeData(node.left, data);
        } else {
          node.left = new Node(data);
        }
      }
    };

    addNodeData(this, data);
  }

  has(data) {
    if (data === null) {
      return false;
    }

    const nodeHasData = (node, data) => {
      if (node === null || node.data === null) {
        return false;
      }

      if (data === node.data) {
        return true;
      }

      if (data > node.data) {
        return nodeHasData(node.right, data);
      } else {
        return nodeHasData(node.left, data);
      }
    };

    return nodeHasData(this, data);
  }

  find(data) {
    if (data === null) {
      return null;
    }

    const nodeSearch = (node, data) => {
      if (node === null || node.data === null) {
        return null;
      }

      if (data === node.data) {
        return node;
      }

      if (data > node.data) {
        return nodeSearch(node.right, data);
      } else {
        return nodeSearch(node.left, data);
      }
    };

    return nodeSearch(this, data);
  }

  remove(data) {
    if (data === null) {
      return;
    }

    const removeNode = (node, data) => {
      if (node === null || node.data === null) {
        return;
      }

      if (data === node.data) {
        let rightCopy = node.right;
        let leftCopy = node.left;

        node.right = null;
        node.left = null;
        node.data = null;

        const addNodeDataBack = (node) => {
          if (node === null || node.data === null) {
            return;
          }

          this.add(node.data);

          addNodeDataBack(node.left);
          addNodeDataBack(node.right);
        }

        addNodeDataBack(rightCopy);
        addNodeDataBack(leftCopy);
        
        return;
      }

      if (data > node.data) {
        removeNode(node.right, data);
      } else {
        removeNode(node.left, data);
      }
    };

    removeNode(this, data);
  }

  min() {
    let temp = this;

    while( temp.left != null ) {
      temp = temp.left;
    }

    return temp.data;
  }

  max() {
    let temp = this;

    while( temp.right != null ) {
      temp = temp.right;
    }

    return temp.data;
  }
}

module.exports = {
  BinarySearchTree
};
