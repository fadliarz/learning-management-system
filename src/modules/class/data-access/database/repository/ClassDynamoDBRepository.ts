import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../common/common-domain/DependencyInjection';
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  TransactWriteCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import DynamoDBConfig from '../../../../../config/DynamoDBConfig';
import DomainException from '../../../../../common/common-domain/exception/DomainException';
import {
  ConditionalCheckFailedException,
  ResourceNotFoundException,
  TransactionCanceledException,
} from '@aws-sdk/client-dynamodb';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import ClassEntity from '../entity/ClassEntity';
import DynamoDBBuilder from '../../../../../common/common-data-access/UpdateBuilder';
import CourseKey from '../../../../course/data-access/database/entity/CourseKey';
import ClassKey from '../entity/ClassKey';
import Pagination from '../../../../../common/common-domain/repository/Pagination';
import CourseNotFoundException from '../../../../course/domain/domain-core/exception/CourseNotFoundException';

@Injectable()
export default class ClassDynamoDBRepository {
  constructor(
    @Inject(DependencyInjection.DYNAMODB_DOCUMENT_CLIENT)
    private readonly dynamoDBDocumentClient: DynamoDBDocumentClient,
    private readonly dynamoDBConfig: DynamoDBConfig,
  ) {}

  public async saveIfNotExistsOrThrow(param: {
    classEntity: ClassEntity;
    domainException: DomainException;
  }): Promise<void> {
    const { classEntity, domainException } = param;
    try {
      await this.dynamoDBDocumentClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Put: {
                TableName: this.dynamoDBConfig.CLASS_TABLE,
                Item: classEntity,
                ConditionExpression:
                  'attribute_not_exists(courseId) AND attribute_not_exists(classId)',
              },
            },
            {
              Update: {
                TableName: this.dynamoDBConfig.COURSE_TABLE,
                Key: new CourseKey({ courseId: classEntity.courseId }),
                ConditionExpression:
                  'attribute_exists(id) AND attribute_exists(courseId)',
                UpdateExpression: 'ADD #numberOfClasses :value0',
                ExpressionAttributeNames: {
                  '#numberOfClasses': 'numberOfClasses',
                },
                ExpressionAttributeValues: {
                  ':value0': 1,
                },
              },
            },
          ],
        }),
      );
    } catch (exception) {
      if (exception instanceof ResourceNotFoundException)
        throw new CourseNotFoundException();
      throw exception instanceof TransactionCanceledException
        ? domainException
        : exception;
    }
  }

  public async findMany(param: {
    courseId: number;
    pagination: Pagination;
  }): Promise<ClassEntity[]> {
    const { courseId, pagination } = param;
    const classEntities: ClassEntity[] = [];
    let lastEvaluatedKey: Record<string, any> | undefined = undefined;
    let limit: number | undefined = pagination.limit;
    do {
      if (limit === 0) break;
      const { Items, LastEvaluatedKey } =
        await this.dynamoDBDocumentClient.send(
          new QueryCommand({
            TableName: this.dynamoDBConfig.CLASS_TABLE,
            KeyConditionExpression: pagination.lastEvaluatedId
              ? '#courseId = :value0 AND classId < :value1'
              : '#courseId = :value0',
            ExpressionAttributeNames: {
              '#courseId': 'courseId',
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
        classEntities.push(
          ...Items.map((item) => strictPlainToClass(ClassEntity, item)),
        );
      }
      lastEvaluatedKey = LastEvaluatedKey as Record<string, any> | undefined;
      if (limit) {
        limit = pagination.limit - classEntities.length;
      }
    } while (lastEvaluatedKey);
    return classEntities;
  }

  public async findByIdOrThrow(param: {
    courseId: number;
    classId: number;
    domainException: DomainException;
  }): Promise<ClassEntity> {
    const { courseId, classId, domainException } = param;
    const response = await this.dynamoDBDocumentClient.send(
      new GetCommand({
        TableName: this.dynamoDBConfig.CLASS_TABLE,
        Key: new ClassKey({ courseId, classId }),
      }),
    );
    if (!response.Item) {
      throw domainException;
    }
    return strictPlainToClass(ClassEntity, response.Item);
  }

  public async saveIfExistsOrThrow(param: {
    classEntity: ClassEntity;
    domainException: DomainException;
  }): Promise<void> {
    const { classEntity, domainException } = param;
    try {
      const { courseId, classId, ...restObj } = classEntity;
      await this.dynamoDBDocumentClient.send(
        new UpdateCommand({
          TableName: this.dynamoDBConfig.CLASS_TABLE,
          Key: new ClassKey({ courseId, classId }),
          ...DynamoDBBuilder.buildUpdate(restObj),
          ConditionExpression:
            'attribute_exists(courseId) AND attribute_exists(classId)',
        }),
      );
    } catch (exception) {
      throw exception instanceof ConditionalCheckFailedException
        ? domainException
        : exception;
    }
  }

  public async deleteIfExistsOrThrow(param: {
    courseId: number;
    classId: number;
    domainException: DomainException;
  }): Promise<void> {
    const { courseId, classId, domainException } = param;
    try {
      await this.dynamoDBDocumentClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Delete: {
                TableName: this.dynamoDBConfig.CLASS_TABLE,
                Key: new ClassKey({ courseId, classId }),
                ConditionExpression:
                  'attribute_exists(courseId) AND attribute_exists(classId)',
              },
            },
            {
              Update: {
                TableName: this.dynamoDBConfig.COURSE_TABLE,
                Key: new CourseKey({ courseId }),
                ConditionExpression:
                  'attribute_exists(id) AND attribute_exists(courseId)',
                UpdateExpression: 'ADD #numberOfClasses :value0',
                ExpressionAttributeNames: {
                  '#numberOfClasses': 'numberOfClasses',
                },
                ExpressionAttributeValues: {
                  ':value0': -1,
                },
              },
            },
          ],
        }),
      );
    } catch (exception) {
      throw exception instanceof ConditionalCheckFailedException
        ? domainException
        : exception;
    }
  }
}
