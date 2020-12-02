/* eslint-disable @typescript-eslint/camelcase */
import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import multer from 'multer';

import uploadConfig from '@config/upload';
import ensureAuthenticated from '@users/infra/http/middlewares/ensureAuthenticated';

import UserController from '@users/infra/http/controllers/UsersController';
import UserAvatarController from '@users/infra/http/controllers/UserAvatarController';

const usersRoutes = Router();
const upload = multer(uploadConfig);
const userController = new UserController();
const userAvatarController = new UserAvatarController();

usersRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  userController.create,
);

usersRoutes.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update,
);

export default usersRoutes;
