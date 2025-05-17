import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../../../domain/application-service/ports/output/repository/NotificationRepository';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import NotificationEntity from '../entity/NotificationEntity';
import Pagination from '../../../../../common/common-domain/repository/Pagination';
import Notification from '../../../domain/domain-core/entity/Notification';
import NotificationDynamoDBRepository from '../repository/NotificationDynamoDBRepository';

@Injectable()
export default class NotificationRepositoryImpl
  implements NotificationRepository
{
  constructor(
    private readonly notificationDynamoDBRepository: NotificationDynamoDBRepository,
  ) {}

  public async findMany(param: {
    userId: number;
    pagination: Pagination;
  }): Promise<Notification[]> {
    const notificationEntities: NotificationEntity[] =
      await this.notificationDynamoDBRepository.findMany(param);
    return notificationEntities.map((notificationEntity) =>
      strictPlainToClass(Notification, notificationEntity),
    );
  }
}
