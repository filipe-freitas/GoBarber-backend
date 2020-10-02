/* eslint-disable @typescript-eslint/camelcase */
import FakeUsersRepository from '@users/repositories/fakes/FakeUsersRepository';
import FakeAppointmentsRepository from '@appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from '@appointments/services/ListProviderMonthAvailability.services';

let fakeUsersRepository: FakeUsersRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('List the providers month availability', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the providers month availability', async () => {
    const provider = await fakeUsersRepository.create({
      name: 'Edward',
      email: 'edward@scissorhands.com',
      password: '111111',
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      date: new Date(2020, 9, 1, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      date: new Date(2020, 9, 1, 9, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      date: new Date(2020, 9, 1, 10, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      date: new Date(2020, 9, 1, 11, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      date: new Date(2020, 9, 1, 12, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      date: new Date(2020, 9, 1, 13, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      date: new Date(2020, 9, 1, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      date: new Date(2020, 9, 1, 15, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      date: new Date(2020, 9, 1, 16, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      date: new Date(2020, 9, 1, 17, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      date: new Date(2020, 9, 2, 8, 0, 0),
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id: provider.id,
      month: 10,
      year: 2020,
    });

    // Espero que seja um array
    // Espero que os dias 1 e 2 estejam com available: false
    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 1, available: false },
        { day: 2, available: true },
        { day: 28, available: true },
      ]),
    );
  });
});
