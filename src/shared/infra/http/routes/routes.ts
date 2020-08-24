import { Router } from 'express';
import appointmentsRouter from '@appointments/infra/http/routes/appointments.routes';
import sessionsRouter from '@users/infra/http/routes/sessions.routes';
import usersRouter from '@users/infra/http/routes/users.routes';

const routes = Router();

// Toda o caminho após /apointments procurará as rotas presentes no appointmentsRouter
routes.use('/appointments', appointmentsRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/users', usersRouter);

export default routes;