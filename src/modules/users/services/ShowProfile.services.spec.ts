/* eslint-disable @typescript-eslint/camelcase */
import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from '@users/services/ShowProfile.services';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show the users profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123123',
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe(user.name);
    expect(profile.email).toBe(user.email);
  });

  it('should not be able to show an unexistent users profile', async () => {
    await expect(
      showProfile.execute({
        user_id: 'unexistent-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
