import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../common/common-domain/DependencyInjection';
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import DynamoDBConfig from '../../../../../config/DynamoDBConfig';
import { TransactionCanceledException } from '@aws-sdk/client-dynamodb';
import EnrollmentEntity from '../entity/EnrollmentEntity';
import CourseKey from '../../../../course/data-access/database/entity/CourseKey';
import EnrollmentKey from '../entity/EnrollmentKey';
import { DynamoDBExceptionCode } from '../../../../../common/common-domain/DynamoDBExceptionCode';
import EnrollmentAlreadyExistsException from '../../../domain/domain-core/exception/EnrollmentAlreadyExistsException';
import CourseNotFoundException from '../../../../course/domain/domain-core/exception/CourseNotFoundException';
import Pagination from '../../../../../common/common-domain/repository/Pagination';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import InternalServerException from '../../../../../common/common-domain/exception/InternalServerException';

@Injectable()
export default class EnrollmentDynamoDBRepository {
  constructor(
    @Inject(DependencyInjection.DYNAMODB_DOCUMENT_CLIENT)
    private readonly dynamoDBDocumentClient: DynamoDBDocumentClient,
    private readonly dynamoDBConfig: DynamoDBConfig,
  ) {}

  public async saveIfNotExistsOrThrow(param: {
    enrollmentEntity: EnrollmentEntity;
  }): Promise<void> {
    const { enrollmentEntity } = param;
    try {
      await this.dynamoDBDocumentClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Put: {
                TableName: this.dynamoDBConfig.ENROLLMENT_TABLE,
                Item: enrollmentEntity,
                ConditionExpression:
                  'attribute_not_exists(userId) AND attribute_not_exists(classId)',
              },
            },
            {
              Update: {
                TableName: this.dynamoDBConfig.COURSE_TABLE,
                Key: new CourseKey({ courseId: enrollmentEntity.courseId }),
                ConditionExpression:
                  'attribute_exists(id) AND attribute_exists(courseId)',
                UpdateExpression: 'ADD #numberOfStudents :value0',
                ExpressionAttributeNames: {
                  '#numberOfStudents': 'numberOfStudents',
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
      if (exception instanceof TransactionCanceledException) {
        const { CancellationReasons } = exception;
        if (!CancellationReasons) throw new InternalServerException();
        if (
          CancellationReasons[0].Code ===
          DynamoDBExceptionCode.CONDITIONAL_CHECK_FAILED
        )
          throw new EnrollmentAlreadyExistsException({ throwable: exception });
        if (
          CancellationReasons[1].Code ===
          DynamoDBExceptionCode.CONDITIONAL_CHECK_FAILED
        )
          throw new CourseNotFoundException({ throwable: exception });
      }
      throw new InternalServerException({ throwable: exception });
    }
  }

  public async findMany(param: {
    userId: number;
    pagination: Pagination;
  }): Promise<EnrollmentEntity[]> {
    const { userId, pagination } = param;
    const enrollmentEntities: EnrollmentEntity[] = [];
    let lastEvaluatedKey: Record<string, any> | undefined = undefined;
    let limit: number | undefined = pagination.limit;
    do {
      if (limit === 0) break;
      const { Items, LastEvaluatedKey } =
        await this.dynamoDBDocumentClient.send(
          new QueryCommand({
            TableName: this.dynamoDBConfig.ENROLLMENT_TABLE,
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
        enrollmentEntities.push(
          ...Items.map((item) => strictPlainToClass(EnrollmentEntity, item)),
        );
      }
      lastEvaluatedKey = LastEvaluatedKey as Record<string, any> | undefined;
      if (limit) {
        limit = pagination.limit - enrollmentEntities.length;
      }
    } while (lastEvaluatedKey);
    return enrollmentEntities;
  }

  public async findById(param: {
    userId: number;
    classId: number;
  }): Promise<EnrollmentEntity | null> {
    const { userId, classId } = param;
    const response = await this.dynamoDBDocumentClient.send(
      new GetCommand({
        TableName: this.dynamoDBConfig.ENROLLMENT_TABLE,
        Key: new EnrollmentKey({ userId, classId }),
      }),
    );
    return response.Item
      ? strictPlainToClass(EnrollmentEntity, response.Item)
      : null;
  }

  public async deleteIfExistsOrThrow(param: {
    userId: number;
    classId: number;
    courseId: number;
  }): Promise<void> {
    const { userId, classId, courseId } = param;
    try {
      await this.dynamoDBDocumentClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Delete: {
                TableName: this.dynamoDBConfig.ENROLLMENT_TABLE,
                Key: new EnrollmentKey({ userId, classId }),
                ExpressionAttributeNames: {
                  '#courseId': 'courseId',
                },
                ExpressionAttributeValues: {
                  ':value0': courseId,
                },
                ConditionExpression:
                  'attribute_exists(userId) AND attribute_exists(classId) AND #courseId = :value0',
              },
            },
            {
              Update: {
                TableName: this.dynamoDBConfig.COURSE_TABLE,
                Key: new CourseKey({ courseId }),
                ConditionExpression:
                  'attribute_exists(id) AND attribute_exists(courseId)',
                UpdateExpression: 'ADD #numberOfStudents :value0',
                ExpressionAttributeNames: {
                  '#numberOfStudents': 'numberOfStudents',
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
      if (exception instanceof TransactionCanceledException) {
        const { CancellationReasons } = exception;
        if (!CancellationReasons)
          throw new InternalServerException({ throwable: exception });
        if (
          CancellationReasons[0].Code ===
            DynamoDBExceptionCode.CONDITIONAL_CHECK_FAILED ||
          CancellationReasons[1].Code ===
            DynamoDBExceptionCode.CONDITIONAL_CHECK_FAILED
        )
          return;
      }
      throw new InternalServerException({ throwable: exception });
    }
  }
}
