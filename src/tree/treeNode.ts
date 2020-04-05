class TreeNode {
  private value: number;
  private leftChildren: TreeNode | null;
  private rightChildren: TreeNode | null;

  public constructor(value: number) {
    this.value = value;

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

  public print(): String {
    return `${this.value}${this.printChildren()}`;
  }

  private printChildren(): String {
    if (this.leftChildren !== null && this.rightChildren !== null) {
      return `(${this.leftChildren.print()}, ${this.rightChildren.print()})`;
    } else if (this.leftChildren !== null) {
      return `(${this.leftChildren.print()})`;
    } else if (this.rightChildren !== null) {
      return `(${this.rightChildren.print()})`
    }
    return '';
  }
};

export default TreeNode;