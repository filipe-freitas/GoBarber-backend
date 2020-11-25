/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable class-methods-use-this */
import { startOfHour, isBefore, getHours } from 'date-fns';

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

    if (isBefore(hourlyAppointment, Date.now())) {
      throw new AppError('You cannot schedule an appointment on a past date.');
    }

    if (provider_id === user_id) {
      throw new AppError('You cannot schedule an appointment with yourself.');
    }

    if (getHours(hourlyAppointment) < 8 || getHours(hourlyAppointment) > 17) {
      throw new AppError(
        'You cannot schedule an appointment outside of working hours.',
      );
    }

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
