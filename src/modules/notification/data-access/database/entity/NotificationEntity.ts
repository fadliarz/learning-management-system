import { Expose } from 'class-transformer';

export default class NotificationEntity {
  @Expose()
  public userId: number;

  @Expose()
  public notificationId: number;

  @Expose()
  public redirect: string;

  @Expose()
  public isSeen: boolean;

  @Expose()
  public title: string;

  @Expose()
  public description: string;
}
