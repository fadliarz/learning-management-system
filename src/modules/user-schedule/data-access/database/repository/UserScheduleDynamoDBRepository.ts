import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../common/common-domain/DependencyInjection';
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import DynamoDBConfig from '../../../../../config/DynamoDBConfig';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import UserScheduleEntity from '../entity/UserScheduleEntity';
import UserScheduleKey from '../entity/UserScheduleKey';
import Pagination from '../../../../../common/common-domain/repository/Pagination';
import UserScheduleNotFoundException from '../../../domain/domain-core/exception/UserScheduleNotFoundException';

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
    rangeQuery?: {
      id?: {
        upper?: number;
        lower?: number;
      };
    };
  }): Promise<UserScheduleEntity[]> {
    const { userId, pagination } = param;
    let rangeQuery: string = '';
    let expressionAttributeValuesExtension = {};
    const upper: number | undefined = param.rangeQuery?.id?.upper;
    const lower: number | undefined = param.rangeQuery?.id?.lower;
    const lastEvaluatedId: number | undefined =
      param.pagination.lastEvaluatedId;
    if (upper && lower) {
      rangeQuery = 'AND scheduleId BETWEEN :lower AND :upper';
      expressionAttributeValuesExtension = {
        ...expressionAttributeValuesExtension,
        ':upper': upper,
        ':lower': lower,
      };
    }
    if (upper && !lower) {
      rangeQuery = 'AND scheduleId < :upper';
      expressionAttributeValuesExtension = {
        ...expressionAttributeValuesExtension,
        ':upper': upper,
      };
    }
    if (!upper && lower) {
      rangeQuery = 'AND scheduleId > :lower';
      expressionAttributeValuesExtension = {
        ...expressionAttributeValuesExtension,
        ':lower': lower,
      };
    }
    if (!upper && !lower && lastEvaluatedId) {
      rangeQuery = 'AND scheduleId < :value1';
      expressionAttributeValuesExtension = {
        ...expressionAttributeValuesExtension,
        ':value1': lastEvaluatedId,
      };
    }
    const userScheduleEntities: UserScheduleEntity[] = [];
    let lastEvaluatedKey: Record<string, any> | undefined = undefined;
    let limit: number | undefined = pagination.limit;
    do {
      if (limit === 0) break;
      const { Items, LastEvaluatedKey } =
        await this.dynamoDBDocumentClient.send(
          new QueryCommand({
            TableName: this.dynamoDBConfig.USER_SCHEDULE_TABLE,
            KeyConditionExpression: `#userId = :value0 ${rangeQuery}`,
            ExpressionAttributeNames: {
              '#userId': 'userId',
            },
            ExpressionAttributeValues: {
              ':value0': userId,
              ...expressionAttributeValuesExtension,
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
  }): Promise<UserScheduleEntity> {
    const { userId, scheduleId } = param;
    const response = await this.dynamoDBDocumentClient.send(
      new GetCommand({
        TableName: this.dynamoDBConfig.USER_SCHEDULE_TABLE,
        Key: new UserScheduleKey({ userId, scheduleId }),
      }),
    );
    if (!response.Item) {
      throw new UserScheduleNotFoundException();
    }
    return strictPlainToClass(UserScheduleEntity, response.Item);
  }
}
