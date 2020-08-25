import { Router } from 'express';

import SessionsController from '@users/infra/http/controllers/SessionsController';

const routes = Router();
const sessionsController = new SessionsController();

routes.post('/', sessionsController.create);

export default routes;
