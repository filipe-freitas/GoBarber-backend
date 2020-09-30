import { Router } from 'express';

import ensureAuthenticated from '@users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '@appointments/infra/http/controllers/ProvidersController';

const providersRouter = Router();
const providersController = new ProvidersController();

providersRouter.use(ensureAuthenticated);
providersRouter.get('/', providersController.index);

export default providersRouter;
