/* eslint-disable @typescript-eslint/camelcase */
import UserToken from '@users/infra/typeorm/entities/userToken';

export default interface IUserTokensRepository {
  generate(user_id: string): Promise<UserToken>;
  findByToken(token: string): Promise<UserToken | undefined>;
}
