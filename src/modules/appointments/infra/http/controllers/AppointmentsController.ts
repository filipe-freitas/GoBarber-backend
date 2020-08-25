/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable class-methods-use-this */
import { Request, Response } from 'express';

import { container } from 'tsyringe';
import { parseISO } from 'date-fns';

import CreateAppointmentService from '@appointments/services/CreateAppointment.services';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { provider_id, date } = request.body;

      const parsedDate = parseISO(date);

      const createAppointment = container.resolve(CreateAppointmentService);
      const appointment = await createAppointment.execute({
        provider_id,
        date: parsedDate,
      });

      return response.status(200).json(appointment);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }
}
