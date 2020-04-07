import { Request, Response } from 'express';

import Tree from '../tree/Tree';
import ReactD3TreeItem from '../types/ReactD3TreeItem';

interface createType {
  Index: any;
  value: number | number[]
}

const tree = new Tree();

export default {
  index(request: Request, response: Response<ReactD3TreeItem>) {
    tree.getTree()
      .then((d3tree) => {
        response.json(d3tree);
      })
      .catch((error) => {
        response.status(204).send();
      })
  },
  search(request: Request, response: Response) {

  },
  create(request: Request, response: Response) {
    const nodeValue = request.body.value;
    tree.addNode(nodeValue);

    console.log(tree.print());

    return response.json(tree.print());
  },
  delete(request: Request, response: Response) {

  },
};