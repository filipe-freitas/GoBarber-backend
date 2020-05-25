import { Router } from 'express';
import appointmentsRouter from './appointments.routes';

const routes = Router();

// Toda o caminho após /apointments procurará as rotas presentes no appointmentsRouter
routes.use('/appointments', appointmentsRouter);

export default routes;
