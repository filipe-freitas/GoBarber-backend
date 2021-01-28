import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@users/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from '@users/services/CreateUser.services';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123123',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('john.doe@example.com');
  });

  it('should not be able to create a new user with an existing email', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123123',
    });

    await expect(
      createUser.execute({
        name: 'Carlos Alberto',
        email: 'john.doe@example.com',
        password: '312321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
