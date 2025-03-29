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
  TransactionCanceledException,
} from '@aws-sdk/client-dynamodb';
import DynamoDBBuilder from '../../../../../common/common-data-access/UpdateBuilder';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import Pagination from '../../../../../common/common-domain/repository/Pagination';
import LessonEntity from '../entity/LessonEntity';
import TimerService from '../../../../../common/common-domain/TimerService';
import CourseEntity from '../../../../course/data-access/database/entity/CourseEntity';
import CourseNotFoundException from '../../../../course/domain/domain-core/exception/CourseNotFoundException';
import CourseDynamoDBRepository from '../../../../course/data-access/database/repository/CourseDynamoDBRepository';
import CourseKey from '../../../../course/data-access/database/entity/CourseKey';
import LessonKey from '../entity/LessonKey';
import { DynamoDBExceptionCode } from '../../../../../common/common-domain/DynamoDBExceptionCode';
import LessonNotFoundException from '../../../domain/domain-core/exception/LessonNotFoundException';

@Injectable()
export default class LessonDynamoDBRepository {
  private readonly POSITION_INCREMENT: number = 10000;
  private readonly BACKOFF_IN_MS: number = 300;

  constructor(
    private readonly courseDynamoDBRepository: CourseDynamoDBRepository,
    @Inject(DependencyInjection.DYNAMODB_DOCUMENT_CLIENT)
    private readonly dynamoDBDocumentClient: DynamoDBDocumentClient,
    private readonly dynamoDBConfig: DynamoDBConfig,
  ) {}

  public async saveIfNotExistsOrThrow(param: {
    lessonEntity: LessonEntity;
    domainException: DomainException;
  }): Promise<void> {
    const { lessonEntity, domainException } = param;
    let RETRIES: number = 0;
    const MAX_RETRIES: number = 5;
    while (RETRIES < MAX_RETRIES) {
      try {
        const courseEntity: CourseEntity =
          await this.courseDynamoDBRepository.findByIdOrThrow({
            courseId: lessonEntity.courseId,
            domainException: new CourseNotFoundException(),
          });
        lessonEntity.position =
          courseEntity.lessonLastPosition + this.POSITION_INCREMENT;
        await this.dynamoDBDocumentClient.send(
          new TransactWriteCommand({
            TransactItems: [
              {
                Put: {
                  TableName: this.dynamoDBConfig.LESSON_TABLE,
                  Item: lessonEntity,
                  ConditionExpression:
                    'attribute_not_exists(courseId) AND attribute_not_exists(lessonId)',
                },
              },
              {
                Update: {
                  TableName: this.dynamoDBConfig.COURSE_TABLE,
                  Key: new CourseKey({ courseId: lessonEntity.courseId }),
                  UpdateExpression:
                    'ADD #lessonPositionVersion :value0 ADD #lessonLastPosition :value1 ADD #numberOfLessons #value2',
                  ConditionExpression:
                    'attribute_exists(id) AND attribute_exists(courseId) AND #lessonPositionVersion = :value3',
                  ExpressionAttributeNames: {
                    '#lessonPositionVersion': 'lessonPositionVersion',
                    '#lessonLastPosition': 'lessonLastPosition',
                    '#numberOfLessons': 'numberOfLessons',
                  },
                  ExpressionAttributeValues: {
                    ':value0': 1,
                    ':value1': this.POSITION_INCREMENT,
                    ':value2': 1,
                    ':value3': courseEntity.lessonPositionVersion,
                  },
                },
              },
            ],
          }),
        );
        return;
      } catch (exception) {
        if (exception instanceof CourseNotFoundException) throw exception;
        if (exception instanceof TransactionCanceledException) {
          const { CancellationReasons } = exception;
          if (!CancellationReasons) throw exception;
          if (
            CancellationReasons[0].Code ===
            DynamoDBExceptionCode.CONDITIONAL_CHECK_FAILED
          )
            throw exception;
        }
        RETRIES++;
        if (RETRIES === MAX_RETRIES) {
          throw exception;
        }
        await TimerService.sleepInMilliseconds(this.BACKOFF_IN_MS);
      }
    }
  }

  public async findMany(param: {
    courseId: number;
    pagination: Pagination;
  }): Promise<LessonEntity[]> {
    const { courseId, pagination } = param;
    const lessonEntities: LessonEntity[] = [];
    let lastEvaluatedKey: Record<string, any> | undefined = undefined;
    let limit: number | undefined = pagination.limit;
    do {
      if (limit === 0) break;
      const { Items, LastEvaluatedKey } =
        await this.dynamoDBDocumentClient.send(
          new QueryCommand({
            TableName: this.dynamoDBConfig.CLASS_TABLE,
            KeyConditionExpression: pagination.lastEvaluatedId
              ? '#courseId = :value0 AND lessonId < :value1'
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
        lessonEntities.push(
          ...Items.map((item) => strictPlainToClass(LessonEntity, item)),
        );
      }
      lastEvaluatedKey = LastEvaluatedKey as Record<string, any> | undefined;
      if (limit) {
        limit = pagination.limit - lessonEntities.length;
      }
    } while (lastEvaluatedKey);
    return lessonEntities;
  }

  public async findByIdOrThrow(param: {
    courseId: number;
    lessonId: number;
    domainException: DomainException;
  }): Promise<LessonEntity> {
    const { courseId, lessonId, domainException } = param;
    const response = await this.dynamoDBDocumentClient.send(
      new GetCommand({
        TableName: this.dynamoDBConfig.LESSON_TABLE,
        Key: new LessonKey({ courseId, lessonId }),
      }),
    );
    if (!response.Item) {
      throw domainException;
    }
    return strictPlainToClass(LessonEntity, response.Item);
  }

  public async saveIfExistsOrThrow(param: {
    lessonEntity: LessonEntity;
    domainException: DomainException;
  }): Promise<void> {
    const { lessonEntity, domainException } = param;
    try {
      const { courseId, lessonId, ...restObj } = lessonEntity;
      const updateObj = DynamoDBBuilder.buildUpdate(restObj);
      if (!updateObj) return;
      await this.dynamoDBDocumentClient.send(
        new UpdateCommand({
          TableName: this.dynamoDBConfig.LESSON_TABLE,
          Key: new LessonKey({ courseId, lessonId }),
          ...updateObj,
          ConditionExpression:
            'attribute_exists(courseId) AND attribute_exists(lessonId)',
        }),
      );
    } catch (exception) {
      if (exception instanceof ConditionalCheckFailedException)
        throw new LessonNotFoundException();
      throw exception;
    }
  }

  public async updateLessonPositionOrThrow(param: {
    lesson: LessonEntity;
    upperLesson: LessonEntity | null;
    lowerLesson: LessonEntity | null;
    version: number;
    domainException: DomainException;
  }): Promise<void> {
    const { lesson, upperLesson, lowerLesson, version, domainException } =
      param;
    const courseId: number = lesson.courseId;
    try {
      let newPosition: number | undefined = undefined;
      if (lowerLesson && upperLesson) {
        newPosition = Math.round(
          (lowerLesson.position + upperLesson.position) / 2,
        );
      }
      if (!lowerLesson && upperLesson) {
        newPosition = upperLesson.position + this.POSITION_INCREMENT;
      }
      if (!upperLesson && lowerLesson) {
        newPosition = lowerLesson.position - this.POSITION_INCREMENT;
      }
      if (!newPosition) {
        throw new DomainException('New position is not defined');
      }
      await this.dynamoDBDocumentClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Update: {
                TableName: this.dynamoDBConfig.LESSON_TABLE,
                Key: new LessonKey({ courseId, lessonId: lesson.lessonId }),
                ConditionExpression:
                  'attribute_exists(courseId) AND attribute_exists(lessonId)',
                UpdateExpression: 'SET #position = :value0',
                ExpressionAttributeNames: {
                  '#position': 'position',
                },
                ExpressionAttributeValues: {
                  ':value0': newPosition,
                },
              },
            },
            {
              Update: {
                TableName: this.dynamoDBConfig.COURSE_TABLE,
                Key: new CourseKey({ courseId }),
                ConditionExpression:
                  'attribute_exists(id) AND attribute_exists(courseId) AND #lessonPositionVersion = :value2',
                UpdateExpression:
                  'ADD #lessonPositionVersion :value0, ADD #lessonLastPosition :value1',
                ExpressionAttributeNames: {
                  '#lessonPositionVersion': 'lessonPositionVersion',
                  '#lessonLastPosition': 'lessonLastPosition',
                },
                ExpressionAttributeValues: {
                  ':value0': 1,
                  ':value1':
                    !lowerLesson && upperLesson ? this.POSITION_INCREMENT : 0,
                  ':value2': version,
                },
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
    domainException: DomainException;
  }): Promise<void> {
    const { courseId, lessonId, domainException } = param;
    try {
      await this.dynamoDBDocumentClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Delete: {
                TableName: this.dynamoDBConfig.LESSON_TABLE,
                Key: new LessonKey({ courseId, lessonId }),
                ConditionExpression:
                  'attribute_exists(courseId) AND attribute_exists(lessonId)',
              },
            },
            {
              Update: {
                TableName: this.dynamoDBConfig.COURSE_TABLE,
                Key: new CourseKey({ courseId }),
                ConditionExpression:
                  'attribute_exists(id) AND attribute_exists(courseId)',
                UpdateExpression: 'ADD #numberOfLessons :value0',
                ExpressionAttributeNames: {
                  '#numberOfLessons': 'numberOfLessons',
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
        if (!CancellationReasons) throw exception;
        if (
          CancellationReasons[0].Code ===
          DynamoDBExceptionCode.CONDITIONAL_CHECK_FAILED
        )
          throw new LessonNotFoundException();
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
