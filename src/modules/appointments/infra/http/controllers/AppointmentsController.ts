/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable class-methods-use-this */
import { Request, Response } from 'express';

import { container } from 'tsyringe';
// import { parseISO } from 'date-fns';

import CreateAppointmentService from '@appointments/services/CreateAppointment.services';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const user_id = request.user.id;
      const { provider_id, date } = request.body;

      // const parsedDate = parseISO(date); Removido porque o parse já foi feito na rota pelo JOI

      const createAppointment = container.resolve(CreateAppointmentService);
      const appointment = await createAppointment.execute({
        provider_id,
        user_id,
        date,
      });

      return response.status(200).json(appointment);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }
}
