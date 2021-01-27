/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable class-methods-use-this */
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAppointmentsService from '@appointments/services/ListProviderAppointments.services';

export default class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { day, month, year } = request.body;

    const listProviderAppointments = container.resolve(
      ListProviderAppointmentsService,
    );

    const appointmentsList = await listProviderAppointments.execute({
      provider_id: user_id,
      day,
      month,
      year,
    });

    return response.json(appointmentsList);
  }
}
