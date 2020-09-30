/* eslint-disable @typescript-eslint/camelcase */
import FakeUsersRepository from '@users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from '@appointments/services/ListProviders.services';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'Thomas Wayne',
      email: 'thomas.wayne@wayne.com',
      password: '123123',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Martha Wayne',
      email: 'martha.wayne@wayne.com',
      password: '321321',
    });

    const user3 = await fakeUsersRepository.create({
      name: 'Bruce Wayne',
      email: 'bruce.wayne@wayne.com',
      password: '123321',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'Edward',
      email: 'edward@scissorhands.com',
      password: '111111',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2, user3]);
  });
});
