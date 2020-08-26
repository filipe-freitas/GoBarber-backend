/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/camelcase */
import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';

import IAppointmentsRepository from '@appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@appointments/dtos/ICreateAppointmentDTO';

import Appointment from '@appointments/infra/typeorm/entities/appointments';

class AppointmentRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async create({
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), date, provider_id });

    this.appointments.push(appointment);

    return appointment;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(appointment =>
      isEqual(appointment.date, date),
    );

    return findAppointment;
  }
}

export default AppointmentRepository;
