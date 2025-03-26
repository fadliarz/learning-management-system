import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../common/common-domain/DependencyInjection';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import DynamoDBConfig from '../../../../../config/DynamoDBConfig';
import DomainException from '../../../../../common/common-domain/exception/DomainException';
import {
  ConditionalCheckFailedException,
  TransactionCanceledException,
} from '@aws-sdk/client-dynamodb';
import DynamoDBBuilder from '../../../../../common/common-data-access/UpdateBuilder';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import CourseScheduleEntity from '../entity/CourseScheduleEntity';
import CourseScheduleKey from '../entity/CourseScheduleKey';
import Pagination from '../../../../../common/common-domain/repository/Pagination';

@Injectable()
export default class CourseScheduleDynamoDBRepository {
  constructor(
    @Inject(DependencyInjection.DYNAMODB_DOCUMENT_CLIENT)
    private readonly dynamoDBDocumentClient: DynamoDBDocumentClient,
    private readonly dynamoDBConfig: DynamoDBConfig,
  ) {}

  public async saveIfNotExistsOrThrow(param: {
    courseScheduleEntity: CourseScheduleEntity;
    domainException: DomainException;
  }): Promise<void> {
    const { courseScheduleEntity, domainException } = param;
    try {
      await this.dynamoDBDocumentClient.send(
        new PutCommand({
          TableName: this.dynamoDBConfig.COURSE_SCHEDULE_TABLE,
          Item: courseScheduleEntity,
          ConditionExpression:
            'attribute_not_exists(courseId) AND attribute_not_exists(scheduleId)',
        }),
      );
    } catch (exception) {
      throw exception instanceof TransactionCanceledException
        ? domainException
        : exception;
    }
  }

  public async findMany(param: {
    courseId: number;
    pagination: Pagination;
  }): Promise<CourseScheduleEntity[]> {
    const { courseId, pagination } = param;
    const courseScheduleEntities: CourseScheduleEntity[] = [];
    let lastEvaluatedKey: Record<string, any> | undefined = undefined;
    let limit: number | undefined = pagination.limit;
    do {
      const { Items, LastEvaluatedKey } =
        await this.dynamoDBDocumentClient.send(
          new QueryCommand({
            TableName: this.dynamoDBConfig.COURSE_SCHEDULE_TABLE,
            KeyConditionExpression: pagination.lastEvaluatedId
              ? '#courseId = :value0 AND #scheduleId < :value1'
              : '#courseId = :value0',
            ExpressionAttributeNames: {
              '#courseId': 'courseId',
              '#scheduleId': 'scheduleId',
            },
            ExpressionAttributeValues: {
              ':value0': courseId,
              ...(pagination.lastEvaluatedId
                ? { ':value1': pagination.lastEvaluatedId }
                : {}),
            },
            ExclusiveStartKey: lastEvaluatedKey,
            Limit: limit,
          }),
        );
      if (Items) {
        courseScheduleEntities.push(
          ...Items.map((item) =>
            strictPlainToClass(CourseScheduleEntity, item),
          ),
        );
      }
      lastEvaluatedKey = LastEvaluatedKey as Record<string, any> | undefined;
      if (limit) {
        limit = pagination.limit - courseScheduleEntities.length;
      }
    } while (lastEvaluatedKey);
    return courseScheduleEntities;
  }

  public async findByIdOrThrow(param: {
    courseId: number;
    scheduleId: number;
    domainException: DomainException;
  }): Promise<CourseScheduleEntity> {
    const { courseId, scheduleId, domainException } = param;
    const response = await this.dynamoDBDocumentClient.send(
      new GetCommand({
        TableName: this.dynamoDBConfig.COURSE_SCHEDULE_TABLE,
        Key: new CourseScheduleKey({ courseId, scheduleId }),
      }),
    );
    if (!response.Item) {
      throw domainException;
    }
    return strictPlainToClass(CourseScheduleEntity, response.Item);
  }

  public async saveIfExistsOrThrow(param: {
    courseScheduleEntity: CourseScheduleEntity;
    domainException: DomainException;
  }): Promise<void> {
    const { courseScheduleEntity, domainException } = param;
    try {
      const { courseId, scheduleId, ...restObj } = courseScheduleEntity;
      const updateObj = DynamoDBBuilder.buildUpdate(restObj);
      if (!updateObj) return;
      await this.dynamoDBDocumentClient.send(
        new UpdateCommand({
          TableName: this.dynamoDBConfig.COURSE_SCHEDULE_TABLE,
          Key: new CourseScheduleKey({ courseId, scheduleId }),
          ...updateObj,
          ConditionExpression:
            'attribute_exists(courseId) AND attribute_exists(scheduleId)',
        }),
      );
    } catch (exception) {
      throw exception instanceof TransactionCanceledException
        ? domainException
        : exception;
    }
  }

  public async deleteIfExistsOrThrow(param: {
    courseId: number;
    scheduleId: number;
    domainException: DomainException;
  }): Promise<void> {
    const { courseId, scheduleId, domainException } = param;
    try {
      await this.dynamoDBDocumentClient.send(
        new DeleteCommand({
          TableName: this.dynamoDBConfig.COURSE_SCHEDULE_TABLE,
          Key: new CourseScheduleKey({ courseId, scheduleId }),
          ConditionExpression:
            'attribute_exists(courseId) AND attribute_exists(scheduleId)',
        }),
      );
    } catch (exception) {
      throw exception instanceof ConditionalCheckFailedException
        ? domainException
        : exception;
    }
  }
}
