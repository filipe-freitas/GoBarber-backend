import { S3 } from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import mime from 'mime';

import uploadCofig from '@config/upload';
import IStorageProvider from '@shared/container/providers/StorageProviders/models/IStorageProvider';

export default class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new S3({
      region: 'us-east-1', // Por que preciso definir a region?
    });
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadCofig.tempFolder, file);
    const ContentType = mime.getType(originalPath);
    if (!ContentType) {
      throw new Error('File not found!');
    }

    const fileContent = await fs.promises.readFile(originalPath);

    await this.client
      .putObject({
        Bucket: uploadCofig.config.aws.bucket,
        Key: file,
        ACL: 'public-read',
        ContentType,
        Body: fileContent,
      })
      .promise();

    await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: uploadCofig.config.aws.bucket,
        Key: file,
      })
      .promise();
  }
}
