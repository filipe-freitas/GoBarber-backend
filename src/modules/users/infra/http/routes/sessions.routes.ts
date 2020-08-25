import { Router } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '@users/services/AuthenticateUser.services';

const routes = Router();

routes.post('/', async (request, response) => {
  const { email, password } = request.body;

  const AuthenticateUser = container.resolve(AuthenticateUserService);

  const { user, token } = await AuthenticateUser.execute({ email, password });

  delete user.password;

  return response.json({ user, token });
});

export default routes;
