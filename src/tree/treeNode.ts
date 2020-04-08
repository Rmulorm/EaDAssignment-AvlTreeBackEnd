import ReactD3TreeItem from "../types/ReactD3TreeItem";

class TreeNode {
  private value: number;
  private treeHeight: number;
  private balanceFactor: number;
  private leftChildren: TreeNode | null;
  private rightChildren: TreeNode | null;

  public constructor(value: number) {
    this.value = value;
    this.treeHeight = 1;
    this.balanceFactor = 0;

    this.leftChildren = null;
    this.rightChildren = null;
  }

  public addNode(value: number) {
    if (value === this.value) {
      throw "This value is already in the Tree";
    }

    if (value < this.value) {
      this.addToTheLeft(value);
    } else {
      this.toToTheRight(value);
    }

    this.updateTreeHeight();
    this.updateBalanceFactor();
  }

  private addToTheLeft(value: number) {
    if (this.leftChildren === null) {
      this.leftChildren = new TreeNode(value);
    }
    else {
      this.leftChildren.addNode(value);
    }
  }
    
  private toToTheRight(value: number) {
    if (this.rightChildren === null) {
      this.rightChildren = new TreeNode(value);
    }
    else {
      this.rightChildren.addNode(value);
    }
  }

  private updateTreeHeight() {
    const leftTreeHeight = this.getChildrenTreeHeight(this.leftChildren);
    const rightTreeHeight = this.getChildrenTreeHeight(this.rightChildren);

    if (leftTreeHeight > rightTreeHeight) {
      this.treeHeight = leftTreeHeight + 1;
    } else {
      this.treeHeight = rightTreeHeight + 1;
    }
  }

  private updateBalanceFactor() {
    const leftTreeHeight = this.getChildrenTreeHeight(this.leftChildren);
    const rightTreeHeight = this.getChildrenTreeHeight(this.rightChildren);

    this.balanceFactor = leftTreeHeight - rightTreeHeight;
  }

  private getChildrenTreeHeight(children: TreeNode | null) {
    if (children)
      return children.treeHeight;

    return 0;
  }

  public getTree(): ReactD3TreeItem {
    const tree: ReactD3TreeItem = {
      name: String(this.value),
      attributes: {
        height: String(this.treeHeight),
        balanceFactor: String(this.balanceFactor)
      },
      children: this.getChildrenTrees()
    }

    return tree;
  }

  private getChildrenTrees(): ReactD3TreeItem[] | undefined {
    const childrenTrees: ReactD3TreeItem[] = new Array<ReactD3TreeItem>();

    if (this.leftChildren)
      childrenTrees.push(this.leftChildren.getTree());
    if (this.rightChildren)
      childrenTrees.push(this.rightChildren.getTree());

    if (childrenTrees.length >= 1)
      return childrenTrees;
  }
};

export default TreeNode;