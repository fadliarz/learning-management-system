import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../common/common-domain/DependencyInjection';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
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
import CourseEntity from '../entity/CourseEntity';
import CourseKey from '../entity/CourseKey';

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
      throw exception instanceof TransactionCanceledException
        ? domainException
        : exception;
    }
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
      throw exception instanceof TransactionCanceledException
        ? domainException
        : exception;
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
      throw exception instanceof ConditionalCheckFailedException
        ? domainException
        : exception;
    }
  }
}
