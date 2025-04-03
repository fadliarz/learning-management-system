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
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import DynamoDBBuilder from '../../../../../common/common-data-access/UpdateBuilder';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import CourseEntity from '../entity/CourseEntity';
import CourseKey from '../entity/CourseKey';
import Pagination from '../../../../../common/common-domain/repository/Pagination';

@Injectable()
export default class CourseDynamoDBRepository {
  constructor(
    @Inject(DependencyInjection.DYNAMODB_DOCUMENT_CLIENT)
    private readonly dynamoDBDocumentClient: DynamoDBDocumentClient,
    private readonly dynamoDBConfig: DynamoDBConfig,
  ) {}

  public async saveIfNotExistsOrThrow(param: {
    courseEntity: CourseEntity;
    domainException: DomainException;
  }): Promise<void> {
    const { courseEntity, domainException } = param;
    try {
      await this.dynamoDBDocumentClient.send(
        new PutCommand({
          TableName: this.dynamoDBConfig.COURSE_TABLE,
          Item: { ...courseEntity, id: 'COURSE' },
          ConditionExpression:
            'attribute_not_exists(id) AND attribute_not_exists(courseId)',
        }),
      );
    } catch (exception) {
      if (exception instanceof ConditionalCheckFailedException)
        throw domainException;
      throw exception;
    }
  }

  public async findMany(param: {
    pagination: Pagination;
  }): Promise<CourseEntity[]> {
    const { pagination } = param;
    const courseEntities: CourseEntity[] = [];
    let lastEvaluatedKey: Record<string, any> | undefined = undefined;
    let limit: number | undefined = pagination.limit;
    do {
      if (limit === 0) break;
      const { Items, LastEvaluatedKey } =
        await this.dynamoDBDocumentClient.send(
          new QueryCommand({
            TableName: this.dynamoDBConfig.COURSE_TABLE,
            KeyConditionExpression: pagination.lastEvaluatedId
              ? '#id = :value0 AND courseId < :value1'
              : '#id = :value0',
            ExpressionAttributeNames: {
              '#id': 'id',
            },
            ExpressionAttributeValues: {
              ':value0': 'COURSE',
              ...(pagination.lastEvaluatedId
                ? { ':value1': pagination.lastEvaluatedId }
                : {}),
            },
            ExclusiveStartKey: lastEvaluatedKey,
            Limit: limit,
          }),
        );
      if (Items) {
        courseEntities.push(
          ...Items.map((item) => strictPlainToClass(CourseEntity, item)),
        );
      }
      lastEvaluatedKey = LastEvaluatedKey as Record<string, any> | undefined;
      if (limit) {
        limit = pagination.limit - courseEntities.length;
      }
    } while (lastEvaluatedKey);
    return courseEntities;
  }

  public async findByIdOrThrow(param: {
    courseId: number;
    domainException: DomainException;
  }): Promise<CourseEntity> {
    const { courseId, domainException } = param;
    const response = await this.dynamoDBDocumentClient.send(
      new GetCommand({
        TableName: this.dynamoDBConfig.COURSE_TABLE,
        Key: new CourseKey({ courseId }),
      }),
    );
    if (!response.Item) {
      throw domainException;
    }
    return strictPlainToClass(CourseEntity, response.Item);
  }

  public async saveIfExistsOrThrow(param: {
    courseEntity: CourseEntity;
    domainException: DomainException;
  }): Promise<void> {
    const { courseEntity, domainException } = param;
    try {
      const { courseId, ...restObj } = courseEntity;
      const updateObj = DynamoDBBuilder.buildUpdate(restObj);
      if (!updateObj) return;
      await this.dynamoDBDocumentClient.send(
        new UpdateCommand({
          TableName: this.dynamoDBConfig.COURSE_TABLE,
          Key: new CourseKey({ courseId }),
          ...updateObj,
          ConditionExpression:
            'attribute_exists(id) AND attribute_exists(courseId)',
        }),
      );
    } catch (exception) {
      if (exception instanceof ConditionalCheckFailedException)
        throw domainException;
      throw exception;
    }
  }

  public async deleteIfExistsOrThrow(param: {
    courseId: number;
    domainException: DomainException;
  }): Promise<void> {
    const { courseId, domainException } = param;
    try {
      await this.dynamoDBDocumentClient.send(
        new DeleteCommand({
          TableName: this.dynamoDBConfig.COURSE_TABLE,
          Key: new CourseKey({ courseId }),
          ConditionExpression:
            'attribute_exists(id) AND attribute_exists(courseId)',
        }),
      );
    } catch (exception) {
      if (exception instanceof ConditionalCheckFailedException)
        throw domainException;
      throw exception;
    }
  }
}
