/* eslint-disable @typescript-eslint/camelcase */
import { Router } from 'express';

import ensureAuthenticated from '@users/infra/http/middlewares/ensureAuthenticated';

import ProfileController from '@users/infra/http/controllers/ProfileController';

const profileRoutes = Router();
const profileController = new ProfileController();

profileRoutes.use(ensureAuthenticated);

profileRoutes.get('/', profileController.show);
profileRoutes.put('/', profileController.update);

export default profileRoutes;
