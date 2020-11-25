import ICreateNotificationDTO from '@notifications/dtos/ICreateNotificationDTO';
import Notification from '@notifications/infra/typeorm/schemas/Notification';

export default interface INotificationsRepository {
  create(data: ICreateNotificationDTO): Promise<Notification>;
}
