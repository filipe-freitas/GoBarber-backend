/* eslint-disable @typescript-eslint/camelcase */
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@users/repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '@users/providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from '@users/services/ResetPassword.services';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();
    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset an existent users password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123123',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generatedHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPassword.execute({
      token,
      password: '123321',
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generatedHash).toBeCalledWith('123321');
    expect(updatedUser?.password).toBe('123321');
  });

  it('should not be able to reset the password with an unexistent token', async () => {
    await expect(
      resetPassword.execute({
        token: 'unexistent-token',
        password: '123321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with an unexistent user', async () => {
    const token = await fakeUserTokensRepository.generate('unexistent-user');

    await expect(
      resetPassword.execute({
        token: token.token,
        password: '123321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with an expired token', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123123',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({
        token,
        password: '123321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
