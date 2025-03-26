import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../common/common-domain/DependencyInjection';
import {
  DynamoDBDocumentClient,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import DynamoDBConfig from '../../../../../config/DynamoDBConfig';
import DomainException from '../../../../../common/common-domain/exception/DomainException';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import EnrollmentEntity from '../entity/EnrollmentEntity';
import CourseKey from '../../../../course/data-access/database/entity/CourseKey';
import EnrollmentKey from '../entity/EnrollmentKey';

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
      throw exception instanceof ConditionalCheckFailedException
        ? domainException
        : exception;
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
      throw exception instanceof ConditionalCheckFailedException
        ? domainException
        : exception;
    }
  }
}
