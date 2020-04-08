import TreeNode from "./TreeNode";
import ReactD3TreeItem from "../types/ReactD3TreeItem";

class Tree {
  private root: TreeNode | null;

  public constructor() {
    this.root = null;
  }

  public addNode(value: number) {
    if (!this.root) {
      this.root = new TreeNode(value);
    } else {
      this.root.addNode(value);
    }
  }

  public getTree() {
    return(new Promise<ReactD3TreeItem>((resolve, reject) => {
      if (!this.root) {
        reject(new Error("Empty Tree"));
        return;
      }

      resolve(this.root.getTree());
    }));
  }
}

export default Tree;