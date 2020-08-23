/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable class-methods-use-this */
import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Appointment from '../models/appointments.models';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointment {
  // private appointmentsRepository: AppointmentsRepository;

  // constructor(appointmentsRepository: AppointmentsRepository) {
  //   this.appointmentsRepository = appointmentsRepository;
  // }

  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const hourlyAppointment = startOfHour(date);
    const appointmentOnSameDate = await appointmentsRepository.findByDate(
      hourlyAppointment,
    );

    if (appointmentOnSameDate) {
      throw new AppError('Provider already booked!', 400);
      // throw new Error('Provider already booked!'); What's the diff?
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: hourlyAppointment,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointment;
