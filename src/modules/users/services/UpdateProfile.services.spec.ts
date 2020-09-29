/* eslint-disable @typescript-eslint/camelcase */
import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@users/repositories/fakes/FakeUsersRepository';
import UpdateProfileService from '@users/services/UpdateProfile.services';

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the users profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123123',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    });

    expect(updatedUser.name).toBe('Jane Doe');
    expect(updatedUser.email).toBe('jane.doe@example.com');
  });

  it('should be able to update the users password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123123',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: user.name,
      email: user.email,
      old_password: user.password,
      password: '123321',
    });

    expect(updatedUser.password).toBe('123321');
  });

  it('should not be able to update the profile from an unexistent user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'unexistent-user-id',
        name: 'Jane Doe',
        email: 'john.doe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the users e-mail to an existent one', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123123',
    });

    const user = await fakeUsersRepository.create({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: '123123',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Jane Doe',
        email: 'john.doe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the users password with an incorrect former password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123123',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: user.name,
        email: user.email,
        old_password: '121212',
        password: '123321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the users password without former password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123123',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: user.name,
        email: user.email,
        password: '123321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
