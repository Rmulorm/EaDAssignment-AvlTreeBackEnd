import TreeNode from "./TreeNode"
import ReactD3TreeItem from "../types/ReactD3TreeItem";
import SearchNodeReturn from "../types/SearchNodeReturn";

class Tree {
  private root: TreeNode | null;

  public constructor() {
    this.root = null;
  }

  public addNode(value: number) {
    if (!this.root)
      this.root = new TreeNode(value);
    else
      this.root = this.root.insert(value);
  }

  public delete(value:number) {
    return(new Promise((resolve, reject) => {
      if (!this.root) {
        reject(new Error("Empty Tree"));
        return;
      }
      try {
        this.root = this.root.remove(value);
      } catch(error) {
        reject(error);
        return;
      }

      resolve();
    }));
  }

  public searchNode(value: number) {
    return(new Promise<SearchNodeReturn>((resolve, reject) => {
      if (!this.root) {
        reject(new Error("Empty Tree"));
        return;
      }
      const searchTree = this.root.find(value, new Array<number>());
      resolve(searchTree);
    }))
  }

  public getTree(searchNodes: SearchNodeReturn | undefined) {
    return(new Promise<ReactD3TreeItem>((resolve, reject) => {
      if (!this.root) {
        reject(new Error("Empty Tree"));
        return;
      }
      resolve(this.root.getTree(searchNodes));
    }));
  }
}

export default Tree;