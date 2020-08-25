/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
import { hash } from 'bcrypt';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '@users/infra/typeorm/entities/users';
import IUsersRepository from '@users/repositories/IUsersRepository';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUser {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const emailExists = await this.usersRepository.findByEmail(email);

    if (emailExists) {
      throw new AppError('Email already used.', 400);
    }

    const hashedPassword = await hash(password, 8);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateUser;
