import { Router } from 'express';
import { parseISO } from 'date-fns';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointment from '../services/CreateAppointment.services';

// Rota: Receber uma requisição, chamar outro arquivo, devolver uma resposta
const routes = Router();

const appointmentRepository = new AppointmentsRepository();

routes.post('/', (request, response) => {
  try {
    const { provider, date } = request.body;

    const parsedDate = parseISO(date);

    const createAppointment = new CreateAppointment(appointmentRepository);
    const appointment = createAppointment.execute({
      provider,
      date: parsedDate,
    });

    return response.status(200).json(appointment);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

routes.get('/all', (request, response) => {
  const allAppointments = appointmentRepository.all();

  return response.status(200).json(allAppointments);
});

export default routes;
