/** Se a ideia é não depender da camada de infra, por que buscar a entidade dentro dela? */
import Appointment from '@appointments/infra/typeorm/entities/appointments';

import ICreateAppointmentDTO from '@appointments/dtos/ICreateAppointmentDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
}
