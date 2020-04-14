import { Request, Response } from 'express';

import Tree from '../tree/Tree';
import ReactD3TreeItem from '../types/ReactD3TreeItem';
import SearchNodeReturn from '../types/SearchNodeReturn';

const tree = new Tree();

function getSearchNodes(requestQuery: any): SearchNodeReturn | undefined {
  if (requestQuery.isNodeInTheTree && requestQuery.isNodeInTheTree) {
    return <SearchNodeReturn>{
      isNodeInTheTree: (requestQuery.isNodeInTheTree === 'true'),
      searchedNodes: requestQuery.searchedNodes.map((node: String) => { return Number(node) })
    }
  }
}

export default {
  index(request: Request, response: Response<ReactD3TreeItem>) {
    const searchNodes = getSearchNodes(request.query);

    tree.getTree(searchNodes)
    .then((d3tree) => {
      response.json(d3tree);
    })
    .catch(() => {
      response.status(204).send();
    })
  },

  search(request: Request, response: Response) {
    const requiredValue = Number(request.params.number);

    tree.searchNode(requiredValue)
    .then((searchTree) => {
      response.json(searchTree);
    })
    .catch(() => {
      response.status(204).send();
    })
  },

  create(request: Request, response: Response) {
    tree.addNode(request.body.value);

    response.status(204).send();
  },

  delete(request: Request, response: Response) {
    const requiredValue = Number(request.params.number);

    tree.delete(requiredValue)
    .then(() => {
      response.status(200).send();
    })
    .catch(() => {
      response.status(404).send();
    })
  },
};
