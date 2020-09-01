import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from '@users/services/CreateUser.services';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeHashProvider = new FakeHashProvider();
    const fakeUsersRepository = new FakeUsersRepository();
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123123',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('john.doe@example.com');
  });

  it('should not be able to create a new user with an existing email', async () => {
    const fakeHashProvider = new FakeHashProvider();
    const fakeUsersRepository = new FakeUsersRepository();
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

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
