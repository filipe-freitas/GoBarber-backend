/* eslint-disable @typescript-eslint/camelcase */
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@users/repositories/fakes/FakeUserTokensRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import SendPasswordResetMail from '@users/services/SendPasswordResetMail.services';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendPasswordResetMail: SendPasswordResetMail;

describe('SendPasswordResetMail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeMailProvider = new FakeMailProvider();
    sendPasswordResetMail = new SendPasswordResetMail(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover the password using his email', async () => {
    const sentMail = jest.spyOn(fakeMailProvider, 'send');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123123',
    });

    await sendPasswordResetMail.execute({
      email: user.email,
    });

    expect(sentMail).toHaveBeenCalled();
  });

  it('should not be able to recover the password from an unexistent user', async () => {
    await expect(
      sendPasswordResetMail.execute({
        email: 'jane.doe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generatedToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123123',
    });

    await sendPasswordResetMail.execute({
      email: user.email,
    });

    expect(generatedToken).toHaveBeenCalledWith(user.id);
  });
});
