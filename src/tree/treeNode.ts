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

    const balancedTree = this.balanceTree();
    return balancedTree;
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

  public balanceTree(): TreeNode {
    if (this.balanceFactor > 1)
      return this.rotateToTheRight()
    else if (this.balanceFactor < -1)
      return this.rotateToTheLeft()

    return this;
  }

  public rotateToTheRight(): TreeNode {
    if (!this.leftChildren)
      throw new Error("Invalid rotation to the Right: There's no left children");

    if (this.leftChildren.getBalanceFactor() > 0)
      return this.leftChildren.setRightChildren(this);
    else 
      return this.leftChildren.rotateToTheLeft();
  }

  public setRightChildren(node: TreeNode | null): TreeNode {
    node?.setLeftChildren(this.rightChildren);
    this.rightChildren = node;

    return this;
  }

  private rotateToTheLeft(): TreeNode {
    if (!this.rightChildren)
      throw new Error("Invalid rotation to the Right: There's no left children");

    if (this.rightChildren.getBalanceFactor() > 0)
      return this.rightChildren.setLeftChildren(this);
    else 
      return this.rightChildren.rotateToTheRight();
  }

  public setLeftChildren(node: TreeNode | null): TreeNode {
    node?.setRightChildren(this.leftChildren);
    this.leftChildren = node;

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