/* eslint-disable @typescript-eslint/camelcase */
import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '@appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@notifications/repositories/fakes/FakeNotificationsRepository';
import CreateAppointmentService from '@appointments/services/CreateAppointment.services';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 11, 5, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 11, 5, 13),
      provider_id: '123123123',
      user_id: '123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123123');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const currentDate = new Date(2022, 4, 10, 11);

    await createAppointment.execute({
      date: currentDate,
      provider_id: '123123',
      user_id: '123',
    });

    await expect(
      createAppointment.execute({
        date: currentDate,
        provider_id: '123123',
        user_id: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 10, 8, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 10, 7, 12),
        user_id: '123',
        provider_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should no be able to create an appointment when the provider and user are the same', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 10, 8, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 10, 8, 13),
        user_id: '123123',
        provider_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment outside working hours', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 10, 9, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 10, 10, 5),
        user_id: 'user-id',
        provider_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError);

    // jest.spyOn(Date, 'now').mockImplementationOnce(() => {
    //   return new Date(2020, 10, 9, 12).getTime();
    // });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 10, 10, 21),
        user_id: 'user-id',
        provider_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
