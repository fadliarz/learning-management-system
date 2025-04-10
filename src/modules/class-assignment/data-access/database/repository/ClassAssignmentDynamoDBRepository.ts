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
import DynamoDBBuilder from '../../../../../common/common-data-access/UpdateBuilder';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import ClassAssignmentEntity from '../entity/ClassAssignmentEntity';
import ClassKey from '../../../../class/data-access/database/entity/ClassKey';
import CourseKey from '../../../../course/data-access/database/entity/CourseKey';
import ClassAssignmentKey from '../../../domain/domain-core/entity/ClassAssignmentKey';
import Pagination from '../../../../../common/common-domain/repository/Pagination';
import ClassNotFoundException from '../../../../class/domain/domain-core/exception/ClassNotFoundException';

@Injectable()
export default class ClassAssignmentDynamoDBRepository {
  constructor(
    @Inject(DependencyInjection.DYNAMODB_DOCUMENT_CLIENT)
    private readonly dynamoDBDocumentClient: DynamoDBDocumentClient,
    private readonly dynamoDBConfig: DynamoDBConfig,
  ) {}

  public async saveIfNotExistsOrThrow(param: {
    classAssignmentEntity: ClassAssignmentEntity;
    domainException: DomainException;
  }): Promise<void> {
    const { classAssignmentEntity, domainException } = param;
    try {
      await this.dynamoDBDocumentClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Put: {
                TableName: this.dynamoDBConfig.CLASS_ASSIGNMENT_TABLE,
                Item: classAssignmentEntity,
                ConditionExpression:
                  'attribute_not_exists(classId) AND attribute_not_exists(assignmentId)',
              },
            },
            {
              Update: {
                TableName: this.dynamoDBConfig.CLASS_TABLE,
                Key: new ClassKey({
                  courseId: classAssignmentEntity.courseId,
                  classId: classAssignmentEntity.classId,
                }),
                ConditionExpression:
                  'attribute_exists(courseId) AND attribute_exists(classId)',
                UpdateExpression: 'ADD #numberOfAssignments :value0',
                ExpressionAttributeNames: {
                  '#numberOfAssignments': 'numberOfAssignments',
                },
                ExpressionAttributeValues: {
                  ':value0': 1,
                },
              },
            },
            {
              Update: {
                TableName: this.dynamoDBConfig.COURSE_TABLE,
                Key: new CourseKey({
                  courseId: classAssignmentEntity.courseId,
                }),
                ConditionExpression:
                  'attribute_exists(id) AND attribute_exists(courseId)',
                UpdateExpression: 'ADD #numberOfAssignments :value0',
                ExpressionAttributeNames: {
                  '#numberOfAssignments': 'numberOfAssignments',
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
        throw new ClassNotFoundException();
      if (exception instanceof TransactionCanceledException)
        throw domainException;
      throw exception;
    }
  }

  public async findMany(param: {
    classId: number;
    pagination: Pagination;
  }): Promise<ClassAssignmentEntity[]> {
    const { classId, pagination } = param;
    const classAssignmentEntities: ClassAssignmentEntity[] = [];
    let lastEvaluatedKey: Record<string, any> | undefined = undefined;
    let limit: number | undefined = pagination.limit;
    do {
      if (limit === 0) break;
      const { Items, LastEvaluatedKey } =
        await this.dynamoDBDocumentClient.send(
          new QueryCommand({
            TableName: this.dynamoDBConfig.CLASS_ASSIGNMENT_TABLE,
            KeyConditionExpression: pagination.lastEvaluatedId
              ? '#classId = :value0 AND assignmentId < :value1'
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
        classAssignmentEntities.push(
          ...Items.map((item) =>
            strictPlainToClass(ClassAssignmentEntity, item),
          ),
        );
      }
      lastEvaluatedKey = LastEvaluatedKey as Record<string, any> | undefined;
      if (limit) {
        limit = pagination.limit - classAssignmentEntities.length;
      }
    } while (lastEvaluatedKey);
    return classAssignmentEntities;
  }

  public async findByIdOrThrow(param: {
    classId: number;
    assignmentId: number;
    domainException: DomainException;
  }): Promise<ClassAssignmentEntity> {
    const { classId, assignmentId, domainException } = param;
    const response = await this.dynamoDBDocumentClient.send(
      new GetCommand({
        TableName: this.dynamoDBConfig.CLASS_ASSIGNMENT_TABLE,
        Key: new ClassAssignmentKey({ classId, assignmentId }),
      }),
    );
    if (!response.Item) {
      throw domainException;
    }
    return strictPlainToClass(ClassAssignmentEntity, response.Item);
  }

  public async saveIfExistsOrThrow(param: {
    classAssignmentEntity: ClassAssignmentEntity;
    domainException: DomainException;
  }): Promise<void> {
    const { classAssignmentEntity, domainException } = param;
    try {
      const { classId, assignmentId, ...restObj } = classAssignmentEntity;
      await this.dynamoDBDocumentClient.send(
        new UpdateCommand({
          TableName: this.dynamoDBConfig.CLASS_ASSIGNMENT_TABLE,
          Key: new ClassAssignmentKey({ classId, assignmentId }),
          ...DynamoDBBuilder.buildUpdate(restObj),
          ConditionExpression:
            'attribute_exists(classId) AND attribute_exists(assignmentId)',
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
    classId: number;
    assignmentId: number;
    domainException: DomainException;
  }): Promise<void> {
    const { courseId, classId, assignmentId, domainException } = param;
    try {
      await this.dynamoDBDocumentClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Delete: {
                TableName: this.dynamoDBConfig.CLASS_ASSIGNMENT_TABLE,
                Key: new ClassAssignmentKey({ classId, assignmentId }),
                ConditionExpression:
                  'attribute_exists(classId) AND attribute_exists(assignmentId)',
              },
            },
            {
              Update: {
                TableName: this.dynamoDBConfig.CLASS_TABLE,
                Key: new ClassKey({ courseId, classId }),
                ConditionExpression:
                  'attribute_exists(courseId) AND attribute_exists(classId)',
                UpdateExpression: 'ADD #numberOfAssignments :value0',
                ExpressionAttributeNames: {
                  '#numberOfAssignments': 'numberOfAssignments',
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
                UpdateExpression: 'ADD #numberOfAssignments :value0',
                ExpressionAttributeNames: {
                  '#numberOfAssignments': 'numberOfAssignments',
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
      if (exception instanceof ResourceNotFoundException)
        throw new ClassNotFoundException();
      throw exception;
    }
  }
}
