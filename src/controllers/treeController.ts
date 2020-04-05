import { Request, Response } from 'express';

import Tree from '../tree/Tree';

const tree = new Tree();

export default {
  index(request: Request, response: Response) {

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