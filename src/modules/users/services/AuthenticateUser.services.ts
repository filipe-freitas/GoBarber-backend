/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '@users/infra/typeorm/entities/users';
import authConfig from '@config/auth';
import IUsersRepository from '@users/repositories/IUsersRepository';
import IHashProvider from '@users/providers/HashProvider/models/IHashProvider';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const correctPassword = await this.hashProvider.compareHash(
      password,
      user.password,
    );
    if (!correctPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
