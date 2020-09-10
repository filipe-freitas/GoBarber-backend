/* eslint-disable @typescript-eslint/camelcase */
import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '@appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '@appointments/services/CreateAppointment.services';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '123123123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123123');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const currentDate = new Date(2020, 4, 10, 11);

    await createAppointment.execute({
      date: currentDate,
      provider_id: '123123',
    });

    await expect(
      createAppointment.execute({ date: currentDate, provider_id: '123123' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
