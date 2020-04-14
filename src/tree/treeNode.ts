import ReactD3TreeItem, { NodeSvgShape } from "../types/ReactD3TreeItem";
import SearchNodeReturn from "../types/SearchNodeReturn";

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

  public getValue(): number {
    return this.value;
  }

  public getTreeHeight(): number {
    return this.treeHeight;
  }

  public getBalanceFactor(): number {
    return this.balanceFactor;
  }

  public setRightChildren(node: TreeNode | null) {
    this.rightChildren = node;

    this.updateTreeHeight();
    this.updateBalanceFactor();
  }

  public setLeftChildren(node: TreeNode | null) {
    this.leftChildren = node;

    this.updateTreeHeight();
    this.updateBalanceFactor();
  }

  public insert(value: number): TreeNode {
    if (value === this.value) {
      throw new Error("This value is already in the Tree");
    }

    if (value < this.value) {
      this.leftChildren = this.insertToTheLeft(value);
    } else {
      this.rightChildren = this.insertToTheRight(value);
    }

    this.updateTreeHeight();
    this.updateBalanceFactor();

    return this.balanceTree();
  }

  private insertToTheLeft(value: number): TreeNode {
    if (this.leftChildren === null)
      return new TreeNode(value);
    else
      return this.leftChildren.insert(value);
  }

  private insertToTheRight(value: number): TreeNode {
    if (this.rightChildren === null)
      return new TreeNode(value);
    else
      return this.rightChildren.insert(value);
  }

  public insertNode(node: TreeNode): TreeNode {

    if (node.getValue() < this.value) {
      this.leftChildren = this.insertNodeToTheLeft(node);
    } else {
      this.rightChildren = this.insertNodeToTheRight(node);
    }

    this.updateTreeHeight();
    this.updateBalanceFactor();

    return this.balanceTree();
  }

  private insertNodeToTheLeft(node: TreeNode): TreeNode {
    if (this.leftChildren === null)
      return node;
    else
      return this.leftChildren.insertNode(node);
  }

  private insertNodeToTheRight(node: TreeNode): TreeNode {
    if (this.rightChildren === null)
      return node;
    else
      return this.rightChildren.insertNode(node);
  }

  private balanceTree(): TreeNode {
    if (this.balanceFactor > 1)
      return this.rotateToTheRight()
    else if (this.balanceFactor < -1)
      return this.rotateToTheLeft()

    return this;
  }

  public rotateToTheRight(): TreeNode {
    if (!this.leftChildren)
      throw new Error("Invalid rotation to the Right: There's no left children");

    if (this.leftChildren.getBalanceFactor() < 0)
      this.leftChildren = this.leftChildren.rotateToTheLeft();

    return this.leftChildren.updateRightChildren(this);
  }

  public updateRightChildren(node: TreeNode | null): TreeNode {
    node?.setLeftChildren(this.rightChildren);
    this.setRightChildren(node);

    return this;
  }

  private rotateToTheLeft(): TreeNode {
    if (!this.rightChildren)
      throw new Error("Invalid rotation to the Right: There's no left children");

    if (this.rightChildren.getBalanceFactor() > 0)
      this.rightChildren = this.rightChildren.rotateToTheRight();

    return this.rightChildren.updateLeftChildren(this);
  }

  public updateLeftChildren(node: TreeNode | null): TreeNode {
    node?.setRightChildren(this.leftChildren);
    this.setLeftChildren(node);

    return this;
  }

  private updateTreeHeight() {
    const leftTreeHeight = this.getChildrenTreeHeight(this.leftChildren);
    const rightTreeHeight = this.getChildrenTreeHeight(this.rightChildren);

    this.treeHeight = Math.max(leftTreeHeight, rightTreeHeight) + 1;
  }

  private updateBalanceFactor() {
    const leftTreeHeight = this.getChildrenTreeHeight(this.leftChildren);
    const rightTreeHeight = this.getChildrenTreeHeight(this.rightChildren);

    this.balanceFactor = leftTreeHeight - rightTreeHeight;
  }

  private getChildrenTreeHeight(children: TreeNode | null) {
    if (children)
      return children.getTreeHeight();

    return 0;
  }

  public remove(value: number): TreeNode | null {
    if (value < this.value && this.leftChildren) {
      this.setLeftChildren(this.leftChildren.remove(value));
      return this.balanceTree();
    } else if (value > this.value && this.rightChildren) {
      this.setRightChildren(this.rightChildren.remove(value));
      return this.balanceTree();
    } else if (value === this.value)
      return this.removeMyself();

    throw new Error('Value is not in the Tree');
  }

  private removeMyself(): TreeNode | null {
    if (this.leftChildren && this.rightChildren)
      return this.leftChildren.insertNode(this.rightChildren)
    else if (this.leftChildren)
      return this.leftChildren;
    else if (this.rightChildren)
      return this.rightChildren;
    else
      return null;
  }

  public find(requiredValue: number, searchedNodes: number[]): SearchNodeReturn {
    searchedNodes.push(this.value);

    if (this.value === requiredValue){
      return <SearchNodeReturn>{
        isNodeInTheTree: true,
        searchedNodes: searchedNodes
      }
    }

    if ((requiredValue < this.value) && this.leftChildren) {
      return this.leftChildren.find(requiredValue, searchedNodes);
    } else if ((requiredValue > this.value) && this.rightChildren) {
      return this.rightChildren.find(requiredValue, searchedNodes);
    }

    return <SearchNodeReturn>{
      isNodeInTheTree: false,
      searchedNodes: searchedNodes
    }
  }

  public getTree(searchNodes: SearchNodeReturn | undefined): ReactD3TreeItem {
    const nodeShapeProps = this.getNodeShapeProps(searchNodes);

    return <ReactD3TreeItem>{
      name: String(this.value),
      nodeSvgShape: nodeShapeProps,
      attributes: {
        height: String(this.treeHeight),
        balanceFactor: String(this.balanceFactor)
      },
      children: this.getChildrenTrees(searchNodes)
    };
  }

  private getNodeShapeProps(searchNodes: SearchNodeReturn | undefined): NodeSvgShape | undefined {
    if (searchNodes && searchNodes.searchedNodes.includes(this.value)) {
      return <NodeSvgShape>{
        shapeProps: {
          r: 10,
          fill: (searchNodes.isNodeInTheTree) ? 'green' : 'red',
          stroke: (searchNodes.isNodeInTheTree) ? 'green' : 'red'
        }
      };
    }
  }

  private getChildrenTrees(searchNodes: SearchNodeReturn | undefined): ReactD3TreeItem[] | undefined {
    const childrenTrees: ReactD3TreeItem[] = new Array<ReactD3TreeItem>();

    if (this.leftChildren)
      childrenTrees.push(this.leftChildren.getTree(searchNodes));
    if (this.rightChildren)
      childrenTrees.push(this.rightChildren.getTree(searchNodes));

    if (childrenTrees.length >= 1)
      return childrenTrees;
  }

};

export default TreeNode;