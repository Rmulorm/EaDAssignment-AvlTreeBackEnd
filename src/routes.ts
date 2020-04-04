import { Router, Request, Response } from 'express';
import treeController from './controllers/treeController';

const routes = Router();

routes.get('/', (request: Request, response: Response) => {
  return response.json('This is the Back End of the first class assignment of Advanced Data Structures\nAuthors: Eduardo Cruz e Romulo Maciel');
})

routes.get('/tree', treeController.index);
routes.get('/tree/:number', treeController.search);
routes.post('/tree', treeController.create);
routes.delete('/tree', treeController.delete);

export default routes;