import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@users/providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from '@users/services/AuthenticateUser.services';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate an user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123123',
    });

    const response = await authenticateUser.execute({
      email: 'john.doe@example.com',
      password: '123123',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate an unexistent user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'john.doe@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate an user with an incorrect password', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123123',
    });

    await expect(
      authenticateUser.execute({
        email: 'john.doe@example.com',
        password: '123124',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
