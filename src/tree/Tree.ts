import TreeNode from "./treeNode";

class Tree {
  private root: TreeNode | null;

  public constructor() {
    this.root = null;
  }

  public addNode(value: number) {
    if (this.root === null) {
      this.root = new TreeNode(value);
    } else {
      this.root.addNode(value);
    }
  }

  public print() {
    return this.root?.print();
  }
}

export default Tree;