/* eslint-disable class-methods-use-this */
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendPasswordResetMailService from '@users/services/SendPasswordResetMail.services';

export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendPasswordResetMail = container.resolve(
      SendPasswordResetMailService,
    );

    await sendPasswordResetMail.execute({ email });

    return response.status(204).json();
  }
}
