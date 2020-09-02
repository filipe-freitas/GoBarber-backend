/* eslint-disable @typescript-eslint/camelcase */
import { uuid } from 'uuidv4';

import IUserTokens from '@users/repositories/IUserTokensRepository';
import UserToken from '@users/infra/typeorm/entities/userToken';

class FakeUserTokensRepository implements IUserTokens {
  private usersTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      user_id,
      token: uuid(),
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.usersTokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    return this.usersTokens.find(userToken => userToken.token === token);
  }
}

export default FakeUserTokensRepository;
