import User from '@users/infra/typeorm/entities/users';
import ICreateUserDTO from '@users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@appointments/dtos/IFindAllProvidersDTO';

export default interface IUsersRepository {
  findAllProviders(data: IFindAllProvidersDTO): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
