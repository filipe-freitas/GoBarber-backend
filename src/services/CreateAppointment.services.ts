import { startOfHour } from 'date-fns';
import Appointment from '../models/appointments.models';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  provider: string;
  date: Date;
}

class CreateAppointment {
  private appointmentsRepository: AppointmentsRepository;

  constructor(appointmentsRepository: AppointmentsRepository) {
    this.appointmentsRepository = appointmentsRepository;
  }

  public execute({ provider, date }: Request): Appointment {
    const hourlyAppointment = startOfHour(date);
    const appointmentOnSameDate = this.appointmentsRepository.findByDate(
      hourlyAppointment,
    );

    if (appointmentOnSameDate) {
      throw Error('Provider already booked!');
      // throw new Error('Provider already booked!'); What's the diff?
    }

    const appointment = this.appointmentsRepository.create({
      provider,
      date: hourlyAppointment,
    });

    return appointment;
  }
}

export default CreateAppointment;
