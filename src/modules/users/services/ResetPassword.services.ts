/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable class-methods-use-this */
import { injectable, inject } from 'tsyringe';
import { differenceInHours, isAfter, addHours } from 'date-fns';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@users/repositories/IUsersRepository';
import IUserTokensRepository from '@users/repositories/IUserTokensRepository';
import IHashProvider from '@users/providers/HashProvider/models/IHashProvider';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserTokensRepository')
    private tokensRepository: IUserTokensRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.tokensRepository.findByToken(token);
    if (!userToken) {
      throw new AppError('User token does not exists.');
    }

    const user = await this.usersRepository.findById(userToken.user_id);
    if (!user) {
      throw new AppError('User does not exists.');
    }

    const tokenCreationDate = userToken.created_at;
    // if (differenceInHours(Date.now(), tokenCreationDate) > 2) {
    //   throw new AppError('Token expired.');
    // }

    const compareDate = addHours(tokenCreationDate, 2);
    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired.');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
