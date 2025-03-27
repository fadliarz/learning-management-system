import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../common/common-domain/DependencyInjection';
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import DynamoDBConfig from '../../../../../config/DynamoDBConfig';
import DomainException from '../../../../../common/common-domain/exception/DomainException';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import UserScheduleEntity from '../entity/UserScheduleEntity';
import UserScheduleKey from '../entity/UserScheduleKey';
import Pagination from '../../../../../common/common-domain/repository/Pagination';

@Injectable()
export default class UserScheduleDynamoDBRepository {
  constructor(
    @Inject(DependencyInjection.DYNAMODB_DOCUMENT_CLIENT)
    private readonly dynamoDBDocumentClient: DynamoDBDocumentClient,
    private readonly dynamoDBConfig: DynamoDBConfig,
  ) {}

  public async findMany(param: {
    userId: number;
    pagination: Pagination;
  }): Promise<UserScheduleEntity[]> {
    const { userId, pagination } = param;
    const userScheduleEntities: UserScheduleEntity[] = [];
    let lastEvaluatedKey: Record<string, any> | undefined = undefined;
    let limit: number | undefined = pagination.limit;
    do {
      const { Items, LastEvaluatedKey } =
        await this.dynamoDBDocumentClient.send(
          new QueryCommand({
            TableName: this.dynamoDBConfig.USER_SCHEDULE_TABLE,
            KeyConditionExpression: pagination.lastEvaluatedId
              ? '#userId = :value0 AND scheduleId < :value1'
              : '#userId = :value0',
            ExpressionAttributeNames: {
              '#userId': 'userId',
            },
            ExpressionAttributeValues: {
              ':value0': userId,
              ...(pagination.lastEvaluatedId
                ? { ':value1': pagination.lastEvaluatedId }
                : {}),
            },
            ExclusiveStartKey: lastEvaluatedKey,
            Limit: limit,
          }),
        );
      if (Items) {
        userScheduleEntities.push(
          ...Items.map((item) => strictPlainToClass(UserScheduleEntity, item)),
        );
      }
      lastEvaluatedKey = LastEvaluatedKey as Record<string, any> | undefined;
      if (limit) {
        limit = pagination.limit - userScheduleEntities.length;
      }
    } while (lastEvaluatedKey);
    return userScheduleEntities;
  }

  public async findByIdOrThrow(param: {
    userId: number;
    scheduleId: number;
    domainException: DomainException;
  }): Promise<UserScheduleEntity> {
    const { userId, scheduleId, domainException } = param;
    const response = await this.dynamoDBDocumentClient.send(
      new GetCommand({
        TableName: this.dynamoDBConfig.USER_SCHEDULE_TABLE,
        Key: new UserScheduleKey({ userId, scheduleId }),
      }),
    );
    if (!response.Item) {
      throw domainException;
    }
    return strictPlainToClass(UserScheduleEntity, response.Item);
  }
}
