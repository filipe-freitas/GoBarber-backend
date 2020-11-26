/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/camelcase */
import { ObjectID } from 'mongodb';

import ICreateNotificationDTO from '@notifications/dtos/ICreateNotificationDTO';

import Notification from '@notifications/infra/typeorm/schemas/Notification';
import INotificationsRepository from '../INotificationsRepository';

class NotificationsRepository implements INotificationsRepository {
  private notification: Notification[] = [];

  public async create({
    recipient_id,
    content,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, { id: new ObjectID(), recipient_id, content });

    this.notification.push(notification);

    return notification;
  }
}

export default NotificationsRepository;
