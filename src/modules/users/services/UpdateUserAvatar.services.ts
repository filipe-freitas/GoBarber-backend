/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable class-methods-use-this */
import path from 'path';
import fs from 'fs';

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '@users/infra/typeorm/entities/users';
import uploadConfig from '@config/upload';
import IUsersRepository from '@users/repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, avatarFileName }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('Only authenticated users can change his avatar', 401);
    }

    if (user.avatar) {
      const avatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const avatarFileExists = await fs.promises.stat(avatarFilePath);

      if (avatarFileExists) {
        await fs.promises.unlink(avatarFilePath);
      }
    }

    user.avatar = avatarFileName;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
