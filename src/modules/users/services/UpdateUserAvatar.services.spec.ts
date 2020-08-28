/* eslint-disable @typescript-eslint/camelcase */
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProviders/fakes/FakeStorageProvider';
import UpdateUserAvatarService from '@users/services/UpdateUserAvatar.services';

describe('UpdateUserAvatar', () => {
  it('should be able to create an users avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123123',
    });

    const updatedAvatarUser = await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'johnDoesPhoto',
    });

    expect(updatedAvatarUser.avatar).toBe('johnDoesPhoto');
  });

  it('should not be able to update an unexistent users avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    expect(
      updateUserAvatar.execute({
        user_id: '1234',
        avatarFileName: 'johnDoesPhoto',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete an users old avatar when updating it', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123123',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'johnDoesPhoto',
    });

    const secondUpdate = await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'johnDoesBetterPhoto',
    });

    expect(deleteFile).toBeCalledWith('johnDoesPhoto');
    expect(secondUpdate.avatar).toBe('johnDoesBetterPhoto');
  });
});
