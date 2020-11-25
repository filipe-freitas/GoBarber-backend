/* eslint-disable @typescript-eslint/camelcase */
import FakeAppointmentsRepository from '@appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from '@appointments/services/ListProviderAppointments.services';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointmentsService: ListProviderAppointmentsService;

describe('ListProviderAppointmentsService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderAppointmentsService = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list all the appointments of a given provider and date', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 0, 2, 8, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 0, 2, 10, 0, 0),
    });

    const appointment3 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 0, 2, 11, 0, 0),
    });

    const availability = await listProviderAppointmentsService.execute({
      provider_id: 'provider',
      day: 2,
      month: 1,
      year: 2020,
    });

    expect(availability).toEqual(
      [appointment1, appointment2, appointment3],
      // expect.arrayContaining([
      //   { hour: 8, available: false },
      //   { hour: 9, available: true },
      //   { hour: 10, available: false },
      //   { hour: 11, available: false },
      //   { hour: 12, available: true },
      //   { hour: 13, available: true },
      //   { hour: 14, available: true },
      //   { hour: 15, available: true },
      //   { hour: 16, available: true },
      // ]),
    );
  });
});
