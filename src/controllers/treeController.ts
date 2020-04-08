import { Request, Response } from 'express';

import Tree from '../tree/Tree';
import ReactD3TreeItem from '../types/ReactD3TreeItem';

const tree = new Tree();

export default {
  index(request: Request, response: Response<ReactD3TreeItem>) {
    tree.getTree()
      .then((d3tree) => {
        response.json(d3tree);
      })
      .catch(() => {
        response.status(204).send();
      })
  },

  search(request: Request, response: Response) {

  },

  create(request: Request, response: Response) {
    tree.addNode(request.body.value);

    response.status(204).send();
  },

  delete(request: Request, response: Response) {

  },
};