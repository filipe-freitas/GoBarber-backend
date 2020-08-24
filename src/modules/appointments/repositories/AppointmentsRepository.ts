import { EntityRepository, Repository } from 'typeorm';
import Appointment from '@appointments/infra/typeorm/entities/appointments';

@EntityRepository(Appointment)
class AppointmentRepository extends Repository<Appointment> {
  public async findByDate(date: Date): Promise<Appointment | null> {
    const foundAppointment = await this.findOne({
      where: { date },
    });

    return foundAppointment || null;
  }
}

export default AppointmentRepository;
