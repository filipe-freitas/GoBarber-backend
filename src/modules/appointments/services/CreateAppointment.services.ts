/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable class-methods-use-this */
import { startOfHour } from 'date-fns';

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '@appointments/infra/typeorm/entities/appointments';
import IAppointmentsRepository from '@appointments/repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointment {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    user_id,
    date,
  }: IRequest): Promise<Appointment> {
    const hourlyAppointment = startOfHour(date);
    const appointmentOnSameDate = await this.appointmentsRepository.findByDate(
      hourlyAppointment,
    );

    if (appointmentOnSameDate) {
      throw new AppError('Provider already booked!', 400);
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: hourlyAppointment,
    });

    return appointment;
  }
}

export default CreateAppointment;
