/* eslint-disable class-methods-use-this */
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AuthenticateUserService from '@users/services/AuthenticateUser.services';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const AuthenticateUser = container.resolve(AuthenticateUserService);

    const { user, token } = await AuthenticateUser.execute({ email, password });

    return response.json({ user: classToClass(user), token });
  }
}
