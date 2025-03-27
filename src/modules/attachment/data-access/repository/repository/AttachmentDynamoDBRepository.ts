import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../common/common-domain/DependencyInjection';
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import DynamoDBConfig from '../../../../../config/DynamoDBConfig';
import DomainException from '../../../../../common/common-domain/exception/DomainException';
import AttachmentEntity from '../entity/AttachmentEntity';
import {
  ConditionalCheckFailedException,
  ResourceNotFoundException,
  TransactionCanceledException,
} from '@aws-sdk/client-dynamodb';
import DynamoDBBuilder from '../../../../../common/common-data-access/UpdateBuilder';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import AttachmentKey from '../entity/AttachmentKey';
import LessonKey from '../../../../lesson/data-access/database/entity/LessonKey';
import CourseKey from '../../../../course/data-access/database/entity/CourseKey';
import Pagination from '../../../../../common/common-domain/repository/Pagination';
import LessonNotFoundException from '../../../../lesson/domain/domain-core/exception/LessonNotFoundException';

@Injectable()
export default class AttachmentDynamoDBRepository {
  constructor(
    @Inject(DependencyInjection.DYNAMODB_DOCUMENT_CLIENT)
    private readonly dynamoDBDocumentClient: DynamoDBDocumentClient,
    private readonly dynamoDBConfig: DynamoDBConfig,
  ) {}

  public async saveIfNotExistsOrThrow(param: {
    attachmentEntity: AttachmentEntity;
    domainException: DomainException;
  }): Promise<void> {
    const { attachmentEntity, domainException } = param;
    try {
      const { courseId, lessonId } = attachmentEntity;
      await this.dynamoDBDocumentClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Put: {
                TableName: this.dynamoDBConfig.ATTACHMENT_TABLE,
                Item: attachmentEntity,
                ConditionExpression:
                  'attribute_not_exists(lessonId) AND attribute_not_exists(attachmentId)',
              },
            },
            {
              Update: {
                TableName: this.dynamoDBConfig.LESSON_TABLE,
                Key: new LessonKey({ courseId, lessonId }),
                ConditionExpression:
                  'attribute_exists(courseId) AND attribute_exists(lessonId)',
                UpdateExpression: 'ADD #numberOfAttachments :value0',
                ExpressionAttributeNames: {
                  '#numberOfAttachments': 'numberOfAttachments',
                },
                ExpressionAttributeValues: {
                  ':value0': 1,
                },
              },
            },
            {
              Update: {
                TableName: this.dynamoDBConfig.COURSE_TABLE,
                Key: new CourseKey({ courseId }),
                ConditionExpression: 'attribute_exists(courseId)',
                UpdateExpression: 'ADD #numberOfAttachments :value0',
                ExpressionAttributeNames: {
                  '#numberOfAttachments': 'numberOfAttachments',
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
        throw new LessonNotFoundException();
      throw exception instanceof TransactionCanceledException
        ? domainException
        : exception;
    }
  }

  public async findMany(param: {
    lessonId: number;
    pagination: Pagination;
  }): Promise<AttachmentEntity[]> {
    const { lessonId, pagination } = param;
    const attachmentEntities: AttachmentEntity[] = [];
    let lastEvaluatedKey: Record<string, any> | undefined = undefined;
    let limit: number | undefined = pagination.limit;
    do {
      const { Items, LastEvaluatedKey } =
        await this.dynamoDBDocumentClient.send(
          new QueryCommand({
            TableName: this.dynamoDBConfig.ATTACHMENT_TABLE,
            KeyConditionExpression: pagination.lastEvaluatedId
              ? '#lessonId = :value0 AND attachmentId < :value1'
              : '#lessonId = :value0',
            ExpressionAttributeNames: {
              '#lessonId': 'lessonId',
            },
            ExpressionAttributeValues: {
              ':value0': lessonId,
              ...(pagination.lastEvaluatedId
                ? { ':value1': pagination.lastEvaluatedId }
                : {}),
            },
            ExclusiveStartKey: lastEvaluatedKey,
            Limit: limit,
          }),
        );
      if (Items) {
        attachmentEntities.push(
          ...Items.map((item) => strictPlainToClass(AttachmentEntity, item)),
        );
      }
      lastEvaluatedKey = LastEvaluatedKey as Record<string, any> | undefined;
      if (limit) {
        limit = pagination.limit - attachmentEntities.length;
      }
    } while (lastEvaluatedKey);
    return attachmentEntities;
  }

  public async findByIdOrThrow(param: {
    lessonId: number;
    attachmentId: number;
    domainException: DomainException;
  }): Promise<AttachmentEntity> {
    const { lessonId, attachmentId, domainException } = param;
    const response = await this.dynamoDBDocumentClient.send(
      new GetCommand({
        TableName: this.dynamoDBConfig.ATTACHMENT_TABLE,
        Key: new AttachmentKey({ lessonId, attachmentId }),
      }),
    );
    if (!response.Item) {
      throw domainException;
    }
    return strictPlainToClass(AttachmentEntity, response.Item);
  }

  public async saveIfExistsOrThrow(param: {
    attachmentEntity: AttachmentEntity;
    domainException: DomainException;
  }): Promise<void> {
    const { attachmentEntity, domainException } = param;
    try {
      const { attachmentId, lessonId, ...restObj } = attachmentEntity;
      const updateObj = DynamoDBBuilder.buildUpdate(restObj);
      if (!updateObj) return;
      await this.dynamoDBDocumentClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Update: {
                TableName: this.dynamoDBConfig.ATTACHMENT_TABLE,
                Key: new AttachmentKey({ lessonId, attachmentId }),
                ConditionExpression:
                  'attribute_exists(lessonId) AND attribute_exists(attachmentId)',
                ...updateObj,
              },
            },
          ],
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
    lessonId: number;
    attachmentId: number;
    domainException: DomainException;
  }): Promise<void> {
    const { courseId, lessonId, attachmentId, domainException } = param;
    try {
      await this.dynamoDBDocumentClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Delete: {
                TableName: this.dynamoDBConfig.ATTACHMENT_TABLE,
                Key: new AttachmentKey({ lessonId, attachmentId }),
                ConditionExpression:
                  'attribute_exists(lessonId) AND attribute_exists(attachmentId)',
              },
            },
            {
              Update: {
                TableName: this.dynamoDBConfig.LESSON_TABLE,
                Key: new LessonKey({ courseId, lessonId }),
                ConditionExpression:
                  'attribute_exists(courseId) AND attribute_exists(lessonId)',
                UpdateExpression: 'ADD #numberOfAttachments :value0',
                ExpressionAttributeNames: {
                  '#numberOfAttachments': 'numberOfAttachments',
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
                ConditionExpression: 'attribute_exists(courseId)',
                UpdateExpression: 'ADD #numberOfAttachments :value0',
                ExpressionAttributeNames: {
                  '#numberOfAttachments': 'numberOfAttachments',
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
        throw new LessonNotFoundException();

      throw exception instanceof ConditionalCheckFailedException
        ? domainException
        : exception;
    }
  }
}
