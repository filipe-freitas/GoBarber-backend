/* eslint-disable @typescript-eslint/camelcase */
import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '@appointments/infra/http/controllers/AppointmentsController';
import ProviderAppointmentsController from '@appointments/infra/http/controllers/ProviderAppointmentsController';

// Rota: Receber uma requisição, chamar outro arquivo, devolver uma resposta
const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  appointmentsController.create,
);
appointmentsRouter.get('/me', providerAppointmentsController.index);

// appointmentsRouter.get('/all', async (request, response) => {
//   const allAppointments = await appointmentsRepository.find();

//   return response.status(200).json(allAppointments);
// });

export default appointmentsRouter;
