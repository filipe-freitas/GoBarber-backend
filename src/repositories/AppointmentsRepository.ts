import { EntityRepository, Repository } from 'typeorm';
import Appointment from '../models/appointments.models';

// interface AppointmentDTO {
//   provider: string;
//   date: Date;
// }

@EntityRepository(Appointment)
class AppointmentRepository extends Repository<Appointment> {
  // private appointments: Appointment[];

  // constructor() {
  //   this.appointments = [];
  // }

  public async findByDate(date: Date): Promise<Appointment | null> {
    // const foundAppointment = this.appointments.find(appointment =>
    //   isEqual(appointment.date, date),
    // );

    const foundAppointment = await this.findOne({
      where: { date },
    });

    return foundAppointment || null;
  }

  // public create({ provider, date }: AppointmentDTO): Appointment {
  //   const appointment = new Appointment({ provider, date });

  //   this.appointments.push(appointment);

  //   return appointment;
  // }

  // public all(): Appointment[] {
  //   return this.appointments;
  // }
}

export default AppointmentRepository;
