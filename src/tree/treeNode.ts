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

  public addNode(value: number) {
    if (value === this.value) {
      throw "This value is already in the Tree";
    }

    if (value < this.value) {
      this.addToTheLeft(value);
    } else {
      this.addToTheRight(value);
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
    
  private addToTheRight(value: number) {
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
      return children.getTreeHeight();

    return 0;
  }

  public searchNode(requiredValue: number, searchedNodes: number[]): SearchNodeReturn {
    searchedNodes.push(this.value);

    if (this.value === requiredValue){
      return <SearchNodeReturn>{
        isNodeInTheTree: true,
        searchedNodes: searchedNodes
      }
    }

    if ((requiredValue < this.value) && this.leftChildren) {
      return this.leftChildren.searchNode(requiredValue, searchedNodes);
    } else if ((requiredValue > this.value) && this.rightChildren) {
      return this.rightChildren.searchNode(requiredValue, searchedNodes);
    }

    return <SearchNodeReturn>{
      isNodeInTheTree: false,
      searchedNodes: searchedNodes
    }
  }

  public getTree(searchNodes: SearchNodeReturn | undefined): ReactD3TreeItem {
    const nodeShapeProps = this.getNodeShapeProps(searchNodes);

    const tree: ReactD3TreeItem = {
      name: String(this.value),
      nodeSvgShape: nodeShapeProps,
      attributes: {
        height: String(this.treeHeight),
        balanceFactor: String(this.balanceFactor)
      },
      children: this.getChildrenTrees(searchNodes)
    }

    return tree;
  }

  private getNodeShapeProps(searchNodes: SearchNodeReturn | undefined): NodeSvgShape | undefined {
    if (searchNodes) {
      if (searchNodes.searchedNodes.includes(this.value)) {
        return <NodeSvgShape>{
          shapeProps: {
            r: 10,
            fill: (searchNodes.isNodeInTheTree) ? 'green' : 'red',
            stroke: (searchNodes.isNodeInTheTree) ? 'green' : 'red'
          }
        };
      }
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