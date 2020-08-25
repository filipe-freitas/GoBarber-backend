/* eslint-disable @typescript-eslint/camelcase */
import { Router } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import CreateAppointment from '@appointments/services/CreateAppointment.services';
import ensureAuthenticated from '@users/infra/http/middlewares/ensureAuthenticated';

// Rota: Receber uma requisição, chamar outro arquivo, devolver uma resposta
const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post('/', async (request, response) => {
  try {
    const { provider_id, date } = request.body;

    const parsedDate = parseISO(date);

    const createAppointment = container.resolve(CreateAppointment);
    const appointment = await createAppointment.execute({
      provider_id,
      date: parsedDate,
    });

    return response.status(200).json(appointment);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

appointmentsRouter.get('/all', async (request, response) => {
  const allAppointments = await appointmentsRepository.find();

  return response.status(200).json(allAppointments);
});

export default appointmentsRouter;
