import { Router } from 'express';
import appointmentsRouter from '@appointments/infra/http/routes/appointments.routes';
import providersRouter from '@appointments/infra/http/routes/providers.routes';
import sessionsRouter from '@users/infra/http/routes/sessions.routes';
import passwordRouter from '@users/infra/http/routes/password.routes';
import profileRouter from '@users/infra/http/routes/profile.routes';
import usersRouter from '@users/infra/http/routes/users.routes';

const routes = Router();

// Toda o caminho após /apointments procurará as rotas presentes no appointmentsRouter
routes.use('/appointments', appointmentsRouter);
routes.use('/providers', providersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);
routes.use('/users', usersRouter);

export default routes;
