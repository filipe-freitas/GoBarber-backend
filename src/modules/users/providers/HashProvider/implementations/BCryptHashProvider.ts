/* eslint-disable class-methods-use-this */
import { hash, compare } from 'bcrypt';

import IHashProvider from '@users/providers/HashProvider/models/IHashProvider';

export default class BCyprtHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
