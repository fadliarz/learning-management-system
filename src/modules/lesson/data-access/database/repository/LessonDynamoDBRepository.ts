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
import LessonRearrangedException from '../../../domain/domain-core/exception/LessonRearrangedException';
import InternalServerException from '../../../../../common/common-domain/exception/InternalServerException';
import DuplicateKeyException from '../../../../../common/common-domain/exception/DuplicateKeyException';
import ResourceConflictException from '../../../../../common/common-domain/exception/ResourceConflictException';

@Injectable()
export default class LessonDynamoDBRepository {
  constructor(
    private readonly courseDynamoDBRepository: CourseDynamoDBRepository,
    @Inject(DependencyInjection.DYNAMODB_DOCUMENT_CLIENT)
    private readonly dynamoDBDocumentClient: DynamoDBDocumentClient,
    private readonly dynamoDBConfig: DynamoDBConfig,
  ) {}

  public async saveIfNotExistsOrThrow(param: {
    lessonEntity: LessonEntity;
  }): Promise<void> {
    const { lessonEntity } = param;
    let RETRIES: number = 0;
    const MAX_RETRIES: number = 5;
    while (RETRIES <= MAX_RETRIES) {
      try {
        const courseEntity: CourseEntity =
          await this.courseDynamoDBRepository.findByIdOrThrow({
            courseId: lessonEntity.courseId,
          });
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
                  ConditionExpression:
                    'attribute_exists(id) AND attribute_exists(courseId) AND #lessonArrangementVersion = :value0',
                  UpdateExpression:
                    'SET #lessonArrangementVersion = :value1, #numberOfLessons = :value2',
                  ExpressionAttributeNames: {
                    '#lessonArrangementVersion': 'lessonArrangementVersion',
                    '#numberOfLessons': 'numberOfLessons',
                  },
                  ExpressionAttributeValues: {
                    ':value0': courseEntity.lessonArrangementVersion,
                    ':value1': courseEntity.lessonArrangementVersion + 1,
                    ':value2': courseEntity.numberOfLessons + 1,
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
          if (!CancellationReasons) throw new InternalServerException();
          if (
            CancellationReasons[0].Code ===
            DynamoDBExceptionCode.CONDITIONAL_CHECK_FAILED
          )
            throw new DuplicateKeyException({ throwable: exception });
        }
        RETRIES++;
        if (RETRIES > MAX_RETRIES)
          throw new ResourceConflictException({
            throwable: new LessonRearrangedException({ throwable: exception }),
          });
        await TimerService.sleepWith100MsBaseDelayExponentialBackoff(RETRIES);
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
            TableName: this.dynamoDBConfig.LESSON_TABLE,
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
  }): Promise<LessonEntity> {
    const { courseId, lessonId } = param;
    const response = await this.dynamoDBDocumentClient.send(
      new GetCommand({
        TableName: this.dynamoDBConfig.LESSON_TABLE,
        Key: new LessonKey({ courseId, lessonId }),
      }),
    );
    if (!response.Item) {
      throw new DomainException();
    }
    return strictPlainToClass(LessonEntity, response.Item);
  }

  public async saveIfExistsOrThrow(param: {
    lessonEntity: LessonEntity;
  }): Promise<void> {
    const { lessonEntity } = param;
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
    lessonArrangementVersion: number;
  }): Promise<void> {
    const { lesson, upperLesson, lowerLesson, lessonArrangementVersion } =
      param;
    const courseId: number = lesson.courseId;
    let RETRIES: number = 0;
    const MAX_RETRIES: number = 25;
    while (RETRIES <= MAX_RETRIES) {
      try {
        const courseEntity: CourseEntity =
          await this.courseDynamoDBRepository.findByIdOrThrow({
            courseId,
          });
        if (courseEntity.lessonArrangementVersion !== lessonArrangementVersion)
          throw new LessonRearrangedException();
        const lessonToBeDeleted: LessonEntity = await this.findByIdOrThrow({
          courseId,
          lessonId: lesson.lessonId,
        });
        if (upperLesson) {
          await this.findByIdOrThrow({
            courseId,
            lessonId: upperLesson.lessonId,
          });
        }
        if (lowerLesson) {
          await this.findByIdOrThrow({
            courseId,
            lessonId: lowerLesson.lessonId,
          });
        }
        const newPosition: number = this.calculateNewLessonPosition({
          upperLesson,
          lowerLesson,
        });
        await this.dynamoDBDocumentClient.send(
          new TransactWriteCommand({
            TransactItems: [
              {
                Delete: {
                  TableName: this.dynamoDBConfig.LESSON_TABLE,
                  Key: new LessonKey({ courseId, lessonId: lesson.lessonId }),
                  ConditionExpression:
                    'attribute_exists(courseId) AND attribute_exists(lessonId) AND #version = :value0 AND #videoArrangementVersion = :value1',
                  ExpressionAttributeNames: {
                    '#version': 'version',
                    '#videoArrangementVersion': 'videoArrangementVersion',
                  },
                  ExpressionAttributeValues: {
                    ':value0': lessonToBeDeleted.version,
                    ':value1': lessonToBeDeleted.videoArrangementVersion,
                  },
                },
              },
              {
                Put: {
                  TableName: this.dynamoDBConfig.LESSON_TABLE,
                  Item: { ...lessonToBeDeleted, lessonId: newPosition },
                  ConditionExpression:
                    'attribute_not_exists(courseId) AND attribute_not_exists(lessonId)',
                },
              },

              {
                Update: {
                  TableName: this.dynamoDBConfig.COURSE_TABLE,
                  Key: new CourseKey({ courseId }),
                  ConditionExpression:
                    'attribute_exists(id) AND attribute_exists(courseId) AND #lessonArrangementVersion = :value0',
                  UpdateExpression: 'SET #lessonArrangementVersion = :value1',
                  ExpressionAttributeNames: {
                    '#lessonArrangementVersion': 'lessonArrangementVersion',
                  },
                  ExpressionAttributeValues: {
                    ':value0': courseEntity.lessonArrangementVersion,
                    ':value1': courseEntity.lessonArrangementVersion + 1,
                  },
                },
              },
            ],
          }),
        );
        return;
      } catch (exception) {
        if (exception instanceof CourseNotFoundException) throw exception;
        if (exception instanceof LessonRearrangedException) throw exception;
        if (exception instanceof LessonNotFoundException) throw exception;
        if (exception instanceof TransactionCanceledException) {
          const { CancellationReasons } = exception;
          if (!CancellationReasons) throw new DomainException();
          if (
            CancellationReasons[1].Code ===
            DynamoDBExceptionCode.CONDITIONAL_CHECK_FAILED
          )
            throw new DomainException();
          if (
            CancellationReasons[2].Code ===
            DynamoDBExceptionCode.CONDITIONAL_CHECK_FAILED
          )
            throw new LessonRearrangedException();
        }
        RETRIES++;
        if (RETRIES > MAX_RETRIES) throw exception;
        await TimerService.sleepWith1000MsBaseDelayExponentialBackoff(RETRIES);
      }
    }
  }

  private calculateNewLessonPosition(param: {
    upperLesson: LessonEntity | null;
    lowerLesson: LessonEntity | null;
  }): number {
    const { upperLesson, lowerLesson } = param;
    let newPosition: number | undefined = undefined;
    if (lowerLesson && upperLesson) {
      newPosition = Math.round(
        (lowerLesson.lessonId + upperLesson.lessonId) / 2,
      );
    }
    if (!lowerLesson && upperLesson) {
      newPosition = Math.round(upperLesson.lessonId * 1.5);
    }
    if (!upperLesson && lowerLesson) {
      newPosition = Math.round(lowerLesson.lessonId * 0.5);
    }
    if (!newPosition) {
      throw new DomainException('New position is not defined');
    }
    return newPosition;
  }

  public async deleteIfExistsOrThrow(param: {
    courseId: number;
    lessonId: number;
  }): Promise<void> {
    const { courseId, lessonId } = param;
    let RETRIES: number = 0;
    const MAX_RETRIES: number = 25;
    while (RETRIES <= MAX_RETRIES) {
      try {
        const courseEntity: CourseEntity =
          await this.courseDynamoDBRepository.findByIdOrThrow({
            courseId,
          });
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
                    'attribute_exists(id) AND attribute_exists(courseId) AND #lessonArrangementVersion = :value0',
                  UpdateExpression:
                    'SET #lessonArrangementVersion = :value1, #numberOfLessons = :value2',
                  ExpressionAttributeNames: {
                    '#lessonArrangementVersion': 'lessonArrangementVersion',
                    '#numberOfLessons': 'numberOfLessons',
                  },
                  ExpressionAttributeValues: {
                    ':value0': courseEntity.lessonArrangementVersion,
                    ':value1': courseEntity.lessonArrangementVersion + 1,
                    ':value2': courseEntity.numberOfLessons - 1,
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
            throw new LessonNotFoundException();
        }
        RETRIES++;
        if (RETRIES > MAX_RETRIES) {
          throw exception;
        }
      }
    }
  }
}
