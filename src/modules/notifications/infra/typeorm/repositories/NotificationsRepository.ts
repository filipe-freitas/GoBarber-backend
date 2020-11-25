/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable class-methods-use-this */
import { getMongoRepository, MongoRepository } from 'typeorm';

import Notification from '@notifications/infra/typeorm/schemas/Notification';

import ICreateNotificationDTO from '@notifications/dtos/ICreateNotificationDTO';
import INotificationsRepository from '@notifications/repositories/INotificationsRepository';

class NotificationsRepository implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.ormRepository.create({
      content,
      recipient_id,
    });

    await this.ormRepository.save(notification);

    return notification;
  }
}

export default NotificationsRepository;
