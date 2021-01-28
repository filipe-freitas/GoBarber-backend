/* eslint-disable @typescript-eslint/no-explicit-any */
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface ICacheData {
  // key: string;
  // value: string;

  [key: string]: string;
}

export default class FakeCacheProvider implements ICacheProvider {
  private cache: ICacheData = {};

  public async save(key: string, value: any): Promise<void> {
    // this.cache.push({ key, value: JSON.stringify(value) });
    this.cache[key] = JSON.stringify(value);
  }

  public async recover<T>(key: string): Promise<T | null> {
    // const data = this.cache.find(entry => entry.key === key)?.value;
    const data = this.cache[key];
    if (!data) {
      return null;
    }

    return JSON.parse(data) as T;
  }

  public async invalidate(key: string): Promise<void> {
    // this.cache = this.cache.filter(entry => entry.key !== key);
    delete this.cache[key];
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = Object.keys(this.cache).filter(key =>
      key.startsWith(`${prefix}:`),
    );

    keys.forEach(key => delete this.cache[key]);

    // const keys = await this.cache.keys(`${prefix}:*`);
    // const pipeline = this.cache.pipeline();

    // keys.forEach(key => {
    //   pipeline.del(key);
    // });

    // await pipeline.exec();
  }
}
