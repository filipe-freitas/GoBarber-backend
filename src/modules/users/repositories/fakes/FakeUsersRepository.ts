/* eslint-disable @typescript-eslint/camelcase */
import { uuid } from 'uuidv4';

import IUsersRepository from '@users/repositories/IUsersRepository';
import ICreateUserDTO from '@users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@appointments/dtos/IFindAllProvidersDTO';
import User from '@users/infra/typeorm/entities/users';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    return except_user_id
      ? this.users.filter(user => user.id !== except_user_id)
      : this.users;
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid(), name, email, password });

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    // this.users.push(user);
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;

    return user;
  }
}

export default FakeUsersRepository;
