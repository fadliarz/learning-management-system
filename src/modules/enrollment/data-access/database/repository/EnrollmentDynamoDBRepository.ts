import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../common/common-domain/DependencyInjection';
import {
  DynamoDBDocumentClient,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import DynamoDBConfig from '../../../../../config/DynamoDBConfig';
import DomainException from '../../../../../common/common-domain/exception/DomainException';
import { TransactionCanceledException } from '@aws-sdk/client-dynamodb';
import EnrollmentEntity from '../entity/EnrollmentEntity';
import CourseKey from '../../../../course/data-access/database/entity/CourseKey';
import EnrollmentKey from '../entity/EnrollmentKey';
import { DynamoDBExceptionCode } from '../../../../../common/common-domain/DynamoDBExceptionCode';
import EnrollmentAlreadyExistsException from '../../../domain/domain-core/exception/EnrollmentAlreadyExistsException';
import CourseNotFoundException from '../../../../course/domain/domain-core/exception/CourseNotFoundException';
import EnrollmentNotFoundException from '../../../domain/domain-core/exception/EnrollmentNotFoundException';

@Injectable()
export default class EnrollmentDynamoDBRepository {
  constructor(
    @Inject(DependencyInjection.DYNAMODB_DOCUMENT_CLIENT)
    private readonly dynamoDBDocumentClient: DynamoDBDocumentClient,
    private readonly dynamoDBConfig: DynamoDBConfig,
  ) {}

  public async saveIfNotExistsOrThrow(param: {
    enrollmentEntity: EnrollmentEntity;
    domainException: DomainException;
  }): Promise<void> {
    const { enrollmentEntity, domainException } = param;
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
        if (!CancellationReasons) throw new DomainException();
        if (
          CancellationReasons[0].Code ===
          DynamoDBExceptionCode.CONDITIONAL_CHECK_FAILED
        )
          throw new EnrollmentAlreadyExistsException();
        if (
          CancellationReasons[1].Code ===
          DynamoDBExceptionCode.CONDITIONAL_CHECK_FAILED
        )
          throw new CourseNotFoundException();
      }
      throw exception;
    }
  }

  public async deleteIfExistsOrThrow(param: {
    userId: number;
    classId: number;
    courseId: number;
    domainException: DomainException;
  }): Promise<void> {
    const { userId, classId, courseId, domainException } = param;
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
        if (!CancellationReasons) throw new DomainException();
        if (
          CancellationReasons[0].Code ===
          DynamoDBExceptionCode.CONDITIONAL_CHECK_FAILED
        )
          throw new EnrollmentNotFoundException();
        if (
          CancellationReasons[1].Code ===
          DynamoDBExceptionCode.CONDITIONAL_CHECK_FAILED
        )
          return;
      }
      throw exception;
    }
  }
}
