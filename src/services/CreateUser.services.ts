/* eslint-disable class-methods-use-this */
import { getRepository } from 'typeorm';
import { hash } from 'bcrypt';

import AppError from '../errors/AppError';

import User from '../models/users.models';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUser {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const emailExists = await usersRepository.findOne({ where: { email } });

    if (emailExists) {
      throw new AppError('Email already used.', 400);
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUser;
