/* eslint-disable @typescript-eslint/camelcase */
import FakeUsersRepository from '@users/repositories/fakes/FakeUsersRepository';
import FakeAppointmentsRepository from '@appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from '@appointments/services/ListProviderDayAvailability.services';

let fakeUsersRepository: FakeUsersRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('List the providers day availability', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the providers day availability', async () => {
    const provider = await fakeUsersRepository.create({
      name: 'Edward',
      email: 'edward@scissorhands.com',
      password: '111111',
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      date: new Date(2020, 9, 16, 13, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      date: new Date(2020, 9, 16, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      date: new Date(2020, 9, 16, 15, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 9, 16, 12).getTime();
    });

    const availability = await listProviderDayAvailability.execute({
      provider_id: provider.id,
      year: 2020,
      month: 10,
      day: 16,
    });

    // Espero que seja um array
    // Espero que os dias 1 e 2 estejam com available: false
    expect(availability).toEqual(
      expect.arrayContaining([
        // { hour: 1, available: false },
        // { hour: 2, available: false },
        { hour: 8, available: false },
        { hour: 10, available: false },
        { hour: 13, available: false },
        { hour: 16, available: true },
        { hour: 17, available: true },
      ]),
    );
  });
});
