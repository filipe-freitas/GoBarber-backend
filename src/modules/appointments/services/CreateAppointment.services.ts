/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable class-methods-use-this */
import { startOfHour, isBefore, getHours, format } from 'date-fns';

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '@appointments/infra/typeorm/entities/appointments';
import IAppointmentsRepository from '@appointments/repositories/IAppointmentsRepository';

import INotificationsRepository from '@notifications/repositories/INotificationsRepository';

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

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
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

    const appointmentDate = format(date, "dd/MM/yyyy 'às' HH:mm'h'");
    await this.notificationsRepository.create({
      recipient_id: user_id,
      content: `Serviço reservado para ${appointmentDate}`,
    });

    return appointment;
  }
}

export default CreateAppointment;
