/* eslint-disable class-methods-use-this */
import IStorageProvider from '@shared/container/providers/StorageProviders/models/IStorageProvider';

export default class FakeStorageProvider implements IStorageProvider {
  private storage: string[] = [];

  public async saveFile(file: string): Promise<string> {
    this.storage.push(file);
    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const fileIndex = this.storage.findIndex(storedFile => storedFile === file);

    this.storage.splice(fileIndex, 1);
  }
}
