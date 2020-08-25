/* eslint-disable @typescript-eslint/camelcase */
import { Router } from 'express';
import { container } from 'tsyringe';
import multer from 'multer';

import uploadConfig from '@config/upload';
import CreateUserService from '@users/services/CreateUser.services';
import ensureAuthenticated from '@users/infra/http/middlewares/ensureAuthenticated';
import UpdateUserAvatarService from '@users/services/UpdateUserAvatar.services';

const usersRoutes = Router();
const upload = multer(uploadConfig);

usersRoutes.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({ name, email, password });

    delete user.password;

    return response.json(user);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

usersRoutes.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFileName: request.file.filename,
    });

    delete user.password;

    return response.json(user);
  },
);

export default usersRoutes;
