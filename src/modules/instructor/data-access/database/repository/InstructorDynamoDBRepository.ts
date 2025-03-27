import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../common/common-domain/DependencyInjection';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import DynamoDBConfig from '../../../../../config/DynamoDBConfig';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import InstructorEntity from '../entity/InstructorEntity';
import ClassKey from '../../../../class/data-access/database/entity/ClassKey';
import CourseKey from '../../../../course/data-access/database/entity/CourseKey';
import UserKey from '../../../../user/data-access/database/entity/UserKey';
import InstructorKey from '../entity/InstructorKey';
import DomainException from '../../../../../common/common-domain/exception/DomainException';
import Pagination from '../../../../../common/common-domain/repository/Pagination';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';

@Injectable()
export default class InstructorDynamoDBRepository {
  constructor(
    @Inject(DependencyInjection.DYNAMODB_DOCUMENT_CLIENT)
    private readonly dynamoDBDocumentClient: DynamoDBDocumentClient,
    private readonly dynamoDBConfig: DynamoDBConfig,
  ) {}

  public async saveIfNotExistsOrThrow(param: {
    instructorEntity: InstructorEntity;
    domainException: DomainException;
  }): Promise<void> {
    const { instructorEntity, domainException } = param;
    try {
      await this.dynamoDBDocumentClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Put: {
                TableName: this.dynamoDBConfig.INSTRUCTOR_TABLE,
                Item: instructorEntity,
                ConditionExpression:
                  'attribute_not_exists(userId) AND attribute_not_exists(classId)',
              },
            },
            {
              Update: {
                TableName: this.dynamoDBConfig.CLASS_TABLE,
                Key: new ClassKey({
                  courseId: instructorEntity.courseId,
                  classId: instructorEntity.classId,
                }),
                ConditionExpression:
                  'attribute_exists(courseId) AND attribute_exists(classId)',
                UpdateExpression: 'ADD #numberOfInstructors :value0',
                ExpressionAttributeNames: {
                  '#numberOfInstructors': 'numberOfInstructors',
                },
                ExpressionAttributeValues: {
                  ':value0': 1,
                },
              },
            },
            {
              Update: {
                TableName: this.dynamoDBConfig.COURSE_TABLE,
                Key: new CourseKey({ courseId: instructorEntity.courseId }),
                ConditionExpression:
                  'attribute_exists(id) AND attribute_exists(courseId)',
                UpdateExpression: 'ADD #numberOfInstructors :value0',
                ExpressionAttributeNames: {
                  '#numberOfInstructors': 'numberOfInstructors',
                },
                ExpressionAttributeValues: {
                  ':value0': 1,
                },
              },
            },
            {
              Update: {
                TableName: this.dynamoDBConfig.USER_TABLE,
                Key: new UserKey({ userId: instructorEntity.userId }),
                ConditionExpression:
                  'attribute_exists(id) AND attribute_exists(userId)',
                UpdateExpression: 'ADD #numberOfManagedClasses :value0',
                ExpressionAttributeNames: {
                  '#numberOfManagedClasses': 'numberOfManagedClasses',
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
      throw exception instanceof ConditionalCheckFailedException
        ? domainException
        : exception;
    }
  }

  public async findManyByUserId(param: {
    userId: number;
    pagination: Pagination;
  }): Promise<InstructorEntity[]> {
    const { userId, pagination } = param;
    const instructorEntities: InstructorEntity[] = [];
    let lastEvaluatedKey: Record<string, any> | undefined = undefined;
    let limit: number | undefined = pagination.limit;
    do {
      const { Items, LastEvaluatedKey } =
        await this.dynamoDBDocumentClient.send(
          new QueryCommand({
            TableName: this.dynamoDBConfig.INSTRUCTOR_TABLE,
            KeyConditionExpression: pagination.lastEvaluatedId
              ? '#userId = :value0 AND classId < :value1'
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
        instructorEntities.push(
          ...Items.map((item) => strictPlainToClass(InstructorEntity, item)),
        );
      }
      lastEvaluatedKey = LastEvaluatedKey as Record<string, any> | undefined;
      if (limit) {
        limit = pagination.limit - instructorEntities.length;
      }
    } while (lastEvaluatedKey);
    return instructorEntities;
  }

  public async findManyByClassId(param: {
    classId: number;
    pagination: Pagination;
  }): Promise<InstructorEntity[]> {
    const { classId, pagination } = param;
    const instructorEntities: InstructorEntity[] = [];
    let lastEvaluatedKey: Record<string, any> | undefined = undefined;
    let limit: number | undefined = pagination.limit;
    do {
      const { Items, LastEvaluatedKey } =
        await this.dynamoDBDocumentClient.send(
          new QueryCommand({
            TableName: this.dynamoDBConfig.INSTRUCTOR_TABLE,
            KeyConditionExpression: pagination.lastEvaluatedId
              ? '#classId = :value0 AND userId < :value1'
              : '#classId = :value0',
            ExpressionAttributeNames: {
              '#classId': 'classId',
            },
            ExpressionAttributeValues: {
              ':value0': classId,
              ...(pagination.lastEvaluatedId
                ? { ':value1': pagination.lastEvaluatedId }
                : {}),
            },
            ExclusiveStartKey: lastEvaluatedKey,
            Limit: limit,
          }),
        );
      if (Items) {
        instructorEntities.push(
          ...Items.map((item) => strictPlainToClass(InstructorEntity, item)),
        );
      }
      lastEvaluatedKey = LastEvaluatedKey as Record<string, any> | undefined;
      if (limit) {
        limit = pagination.limit - instructorEntities.length;
      }
    } while (lastEvaluatedKey);
    return instructorEntities;
  }

  public async deleteIfExistsOrThrow(param: {
    userId: number;
    courseId: number;
    classId: number;
    domainException: DomainException;
  }): Promise<void> {
    const { userId, courseId, classId, domainException } = param;
    try {
      await this.dynamoDBDocumentClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Delete: {
                TableName: this.dynamoDBConfig.INSTRUCTOR_TABLE,
                Key: new InstructorKey({ userId, classId }),
                ConditionExpression:
                  'attribute_not_exists(userId) AND attribute_not_exists(classId)',
              },
            },
            {
              Update: {
                TableName: this.dynamoDBConfig.CLASS_TABLE,
                Key: new ClassKey({ courseId, classId }),
                ConditionExpression:
                  'attribute_exists(courseId) AND attribute_exists(classId)',
                UpdateExpression: 'ADD #numberOfInstructors :value0',
                ExpressionAttributeNames: {
                  '#numberOfInstructors': 'numberOfInstructors',
                },
                ExpressionAttributeValues: {
                  ':value0': -1,
                },
              },
            },
            {
              Update: {
                TableName: this.dynamoDBConfig.COURSE_TABLE,
                Key: new CourseKey({ courseId }),
                ConditionExpression:
                  'attribute_exists(id) AND attribute_exists(courseId)',
                UpdateExpression: 'ADD #numberOfInstructors :value0',
                ExpressionAttributeNames: {
                  '#numberOfInstructors': 'numberOfInstructors',
                },
                ExpressionAttributeValues: {
                  ':value0': -1,
                },
              },
            },
            {
              Update: {
                TableName: this.dynamoDBConfig.USER_TABLE,
                Key: new UserKey({ userId }),
                ConditionExpression:
                  'attribute_exists(id) AND attribute_exists(userId)',
                UpdateExpression: 'ADD #numberOfManagedClasses :value0',
                ExpressionAttributeNames: {
                  '#numberOfManagedClasses': 'numberOfManagedClasses',
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
