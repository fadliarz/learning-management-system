import { Inject, Injectable } from '@nestjs/common';
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  TransactWriteCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import DomainException from '../../../../../common/common-domain/exception/DomainException';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import VideoEntity from '../entity/VideoEntity';
import { ConditionalCheckFailedException, TransactionCanceledException } from '@aws-sdk/client-dynamodb';
import TimerService from '../../../../../common/common-domain/TimerService';
import { DependencyInjection } from '../../../../../common/common-domain/DependencyInjection';
import DynamoDBConfig from '../../../../../config/DynamoDBConfig';
import LessonNotFoundException from '../../../../lesson/domain/domain-core/exception/LessonNotFoundException';
import LessonEntity from '../../../../lesson/data-access/database/entity/LessonEntity';
import DynamoDBBuilder from '../../../../../common/common-data-access/UpdateBuilder';
import LessonDynamoDBRepository from '../../../../lesson/data-access/database/repository/LessonDynamoDBRepository';
import VideoNotFoundException from '../../../domain/domain-core/exception/VideoNotFoundException';
import LessonKey from '../../../../lesson/data-access/database/entity/LessonKey';
import VideoKey from '../entity/VideoKey';
import CourseKey from '../../../../course/data-access/database/entity/CourseKey';
import Pagination from '../../../../../common/common-domain/repository/Pagination';
import { DynamoDBExceptionCode } from '../../../../../common/common-domain/DynamoDBExceptionCode';
import VideoRearrangedException from '../../../domain/domain-core/exception/VideoRearrangedException';
import CourseNotFoundException from '../../../../course/domain/domain-core/exception/CourseNotFoundException';
import CourseDynamoDBRepository from '../../../../course/data-access/database/repository/CourseDynamoDBRepository';
import CourseEntity from '../../../../course/data-access/database/entity/CourseEntity';

@Injectable()
export default class VideoDynamoDBRepository {
  constructor(
    @Inject(DependencyInjection.DYNAMODB_DOCUMENT_CLIENT)
    private readonly dynamoDBDocumentClient: DynamoDBDocumentClient,
    private readonly dynamoDBConfig: DynamoDBConfig,
    private readonly lessonDynamoDBRepository: LessonDynamoDBRepository,
    private readonly courseDynamoDBRepository: CourseDynamoDBRepository,
  ) {
  }

  public async saveIfNotExistsOrThrow(param: {
    videoEntity: VideoEntity;
    domainException: DomainException;
  }): Promise<void> {
    const { videoEntity } = param;
    let RETRIES: number = 0;
    const MAX_RETRIES: number = 25;
    while (RETRIES <= MAX_RETRIES) {
      try {
        const lessonEntity: LessonEntity =
          await this.lessonDynamoDBRepository.findByIdOrThrow({
            lessonId: videoEntity.lessonId,
            courseId: videoEntity.courseId,
          });
        const courseEntity: CourseEntity =
          await this.courseDynamoDBRepository.findByIdOrThrow({
            courseId: videoEntity.courseId,
          });
        await this.dynamoDBDocumentClient.send(
          new TransactWriteCommand({
            TransactItems: [
              {
                Put: {
                  TableName: this.dynamoDBConfig.VIDEO_TABLE,
                  Item: videoEntity,
                  ConditionExpression:
                    'attribute_not_exists(lessonId) AND attribute_not_exists(videoId)',
                },
              },
              {
                Update: {
                  TableName: this.dynamoDBConfig.LESSON_TABLE,
                  Key: new LessonKey({
                    courseId: videoEntity.courseId,
                    lessonId: videoEntity.lessonId,
                  }),
                  ConditionExpression:
                    'attribute_exists(courseId) AND attribute_exists(lessonId) AND #videoArrangementVersion = :value0 AND #version = :value1',
                  UpdateExpression:
                    'SET #numberOfVideos = :value2, #numberOfDurations = :value3, #videoArrangementVersion = :value4, #version = :value5',
                  ExpressionAttributeNames: {
                    '#videoArrangementVersion': 'videoArrangementVersion',
                    '#version': 'version',
                    '#numberOfVideos': 'numberOfVideos',
                    '#numberOfDurations': 'numberOfDurations',
                  },
                  ExpressionAttributeValues: {
                    ':value0': lessonEntity.videoArrangementVersion,
                    ':value1': lessonEntity.version,
                    ':value2': lessonEntity.numberOfVideos + 1,
                    ':value3':
                      lessonEntity.numberOfDurations +
                      videoEntity.durationInSec,
                    ':value4': lessonEntity.videoArrangementVersion + 1,
                    ':value5': lessonEntity.version + 1,
                  },
                },
              },
              {
                Update: {
                  TableName: this.dynamoDBConfig.COURSE_TABLE,
                  Key: new CourseKey({
                    courseId: videoEntity.courseId,
                  }),
                  ConditionExpression:
                    'attribute_exists(id) AND attribute_exists(courseId) AND #version = :value0',
                  UpdateExpression:
                    'SET #numberOfVideos = :value1, #numberOfDurations = :value2, #version = :value3',
                  ExpressionAttributeNames: {
                    '#version': 'version',
                    '#numberOfVideos': 'numberOfVideos',
                    '#numberOfDurations': 'numberOfDurations',
                  },
                  ExpressionAttributeValues: {
                    ':value0': courseEntity.version,
                    ':value1': courseEntity.numberOfVideos + 1,
                    ':value2':
                      courseEntity.numberOfDurations +
                      videoEntity.durationInSec,
                    ':value3': courseEntity.version + 1,
                  },
                },
              },
            ],
          }),
        );
        return;
      } catch (exception) {
        if (exception instanceof LessonNotFoundException) throw exception;
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
        if (RETRIES === MAX_RETRIES) throw exception;
        await TimerService.sleepWith1000MsBaseDelayExponentialBackoff(RETRIES);
      }
    }
  }

  public async findMany(param: {
    lessonId: number;
    pagination: Pagination;
  }): Promise<VideoEntity[]> {
    const { lessonId, pagination } = param;
    const videoEntities: VideoEntity[] = [];
    let lastEvaluatedKey: Record<string, any> | undefined = undefined;
    let limit: number | undefined = pagination.limit;
    do {
      if (limit === 0) break;
      const { Items, LastEvaluatedKey } =
        await this.dynamoDBDocumentClient.send(
          new QueryCommand({
            TableName: this.dynamoDBConfig.VIDEO_TABLE,
            KeyConditionExpression: pagination.lastEvaluatedId
              ? '#lessonId = :value0 AND videoId < :value1'
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
        videoEntities.push(
          ...Items.map((item) => strictPlainToClass(VideoEntity, item)),
        );
      }
      lastEvaluatedKey = LastEvaluatedKey as Record<string, any> | undefined;
      if (limit) {
        limit = pagination.limit - videoEntities.length;
      }
    } while (lastEvaluatedKey);
    return videoEntities;
  }

  public async findByIdOrThrow(param: {
    lessonId: number;
    videoId: number;
    domainException: DomainException;
  }): Promise<VideoEntity> {
    const { lessonId, videoId, domainException } = param;
    const response = await this.dynamoDBDocumentClient.send(
      new GetCommand({
        TableName: this.dynamoDBConfig.VIDEO_TABLE,
        Key: new VideoKey({ lessonId, videoId }),
      }),
    );
    if (!response.Item) {
      throw domainException;
    }
    return strictPlainToClass(VideoEntity, response.Item);
  }

  public async saveIfExistsOrThrow(param: {
    videoEntity: VideoEntity;
    domainException: DomainException;
  }): Promise<void> {
    let RETRIES: number = 0;
    const MAX_RETRIES: number = 25;
    while (RETRIES <= MAX_RETRIES) {
      const { videoEntity, domainException } = param;
      try {
        const { lessonId, videoId, ...restObj } = videoEntity;
        const updateObj = DynamoDBBuilder.buildUpdate(restObj);
        if (!updateObj) return;
        if (videoEntity.durationInSec) {
          const oldVideoEntity: VideoEntity = await this.findByIdOrThrow({
            lessonId,
            videoId,
            domainException: new VideoNotFoundException(),
          });
          const lessonEntity: LessonEntity =
            await this.lessonDynamoDBRepository.findByIdOrThrow({
              courseId: videoEntity.courseId,
              lessonId,
            });
          const courseEntity: CourseEntity =
            await this.courseDynamoDBRepository.findByIdOrThrow({
              courseId: videoEntity.courseId,
            });
          const durationIncrement: number =
            videoEntity.durationInSec - oldVideoEntity.durationInSec;
          await this.dynamoDBDocumentClient.send(
            new TransactWriteCommand({
              TransactItems: [
                {
                  Update: {
                    TableName: this.dynamoDBConfig.VIDEO_TABLE,
                    Key: new VideoKey({ lessonId, videoId }),
                    ConditionExpression:
                      'attribute_exists(lessonId) AND attribute_exists(videoId) AND #durationInSec = :value0',
                    UpdateExpression: updateObj.UpdateExpression,
                    ExpressionAttributeNames: {
                      '#durationInSec': 'durationInSec',
                      ...updateObj.ExpressionAttributeNames,
                    },
                    ExpressionAttributeValues: {
                      ':value0': oldVideoEntity.durationInSec,
                      ...updateObj.ExpressionAttributeValues,
                    },
                  },
                },
                {
                  Update: {
                    TableName: this.dynamoDBConfig.LESSON_TABLE,
                    Key: new LessonKey({
                      courseId: videoEntity.courseId,
                      lessonId,
                    }),
                    ConditionExpression:
                      'attribute_exists(courseId) AND attribute_exists(lessonId) AND #version = :value0',
                    UpdateExpression:
                      'SET #numberOfDurations = :value1, #version = :value2',
                    ExpressionAttributeNames: {
                      '#version': 'version',
                      '#numberOfDurations': 'numberOfDurations',
                    },
                    ExpressionAttributeValues: {
                      ':value0': lessonEntity.version,
                      ':value1':
                        lessonEntity.numberOfDurations + durationIncrement,
                      ':value2': lessonEntity.version + 1,
                    },
                  },
                },
                {
                  Update: {
                    TableName: this.dynamoDBConfig.COURSE_TABLE,
                    Key: new CourseKey({
                      courseId: videoEntity.courseId,
                    }),
                    ConditionExpression:
                      'attribute_exists(id) AND attribute_exists(courseId) AND #version = :value0',
                    UpdateExpression:
                      'SET #numberOfDurations = :value1, #version = :value2',
                    ExpressionAttributeNames: {
                      '#version': 'version',
                      '#numberOfDurations': 'numberOfDurations',
                    },
                    ExpressionAttributeValues: {
                      ':value0': courseEntity.version,
                      ':value1':
                        courseEntity.numberOfDurations + durationIncrement,
                      ':value2': courseEntity.version + 1,
                    },
                  },
                },
              ],
            }),
          );
        } else {
          await this.dynamoDBDocumentClient.send(
            new UpdateCommand({
              TableName: this.dynamoDBConfig.VIDEO_TABLE,
              Key: new VideoKey({ lessonId, videoId }),
              ...updateObj,
              ConditionExpression:
                'attribute_exists(lessonId) AND attribute_exists(id)',
            }),
          );
        }
        return;
      } catch (exception) {
        if (exception instanceof VideoNotFoundException) throw exception;
        if (exception instanceof LessonNotFoundException) throw exception;
        if (exception instanceof CourseNotFoundException) throw exception;
        if (exception instanceof ConditionalCheckFailedException)
          throw new VideoNotFoundException();
        RETRIES++;
        if (RETRIES === MAX_RETRIES) throw exception;
        await TimerService.sleepWith1000MsBaseDelayExponentialBackoff(RETRIES);
      }
    }
  }

  public async updateVideoPositionOrThrow(param: {
    video: VideoEntity;
    upperVideo: VideoEntity | null;
    lowerVideo: VideoEntity | null;
    version: number;
    domainException: DomainException;
  }): Promise<void> {
    const { video, upperVideo, lowerVideo, version } = param;
    const lessonId: number = video.lessonId;
    let RETRIES: number = 0;
    const MAX_RETRIES: number = 25;
    while (RETRIES <= MAX_RETRIES) {
      try {
        const lessonEntity: LessonEntity =
          await this.lessonDynamoDBRepository.findByIdOrThrow({
            courseId: video.courseId,
            lessonId,
          });
        if (lessonEntity.videoArrangementVersion !== version)
          throw new VideoRearrangedException();
        const videoToBeDeleted: VideoEntity = await this.findByIdOrThrow({
          videoId: video.videoId,
          lessonId,
          domainException: new VideoNotFoundException(),
        });
        if (upperVideo) {
          await this.findByIdOrThrow({
            lessonId,
            videoId: upperVideo.videoId,
            domainException: new VideoNotFoundException(),
          });
        }
        if (lowerVideo) {
          await this.findByIdOrThrow({
            lessonId,
            videoId: lowerVideo.videoId,
            domainException: new VideoNotFoundException(),
          });
        }
        const newPosition: number = this.calculateNewVideoPosition({
          upperVideo,
          lowerVideo,
        });
        await this.dynamoDBDocumentClient.send(
          new TransactWriteCommand({
            TransactItems: [
              {
                Delete: {
                  TableName: this.dynamoDBConfig.VIDEO_TABLE,
                  Key: new VideoKey({ lessonId, videoId: video.videoId }),
                  ConditionExpression:
                    'attribute_exists(lessonId) AND attribute_exists(videoId) AND #durationInSec = :value0',
                  ExpressionAttributeNames: {
                    '#durationInSec': 'durationInSec',
                  },
                  ExpressionAttributeValues: {
                    ':value0': videoToBeDeleted.durationInSec,
                  },
                },
              },
              {
                Put: {
                  TableName: this.dynamoDBConfig.VIDEO_TABLE,
                  Item: { ...videoToBeDeleted, videoId: newPosition },
                  ConditionExpression:
                    'attribute_not_exists(lessonId) AND attribute_not_exists(videoId) AND #durationInSec = :value0',
                  ExpressionAttributeNames: {
                    '#durationInSec': 'durationInSec',
                  },
                  ExpressionAttributeValues: {
                    ':value0': videoToBeDeleted.durationInSec,
                  },
                },
              },
              {
                Update: {
                  TableName: this.dynamoDBConfig.LESSON_TABLE,
                  Key: new LessonKey({ courseId: video.courseId, lessonId }),
                  ConditionExpression:
                    'attribute_exists(courseId) AND attribute_exists(lessonId) AND #videoArrangementVersion = :value0',
                  UpdateExpression: 'SET #videoArrangementVersion = :value1',
                  ExpressionAttributeNames: {
                    '#videoArrangementVersion': 'videoArrangementVersion',
                  },
                  ExpressionAttributeValues: {
                    ':value0': lessonEntity.videoArrangementVersion,
                    ':value1': lessonEntity.videoArrangementVersion + 1,
                  },
                },
              },
            ],
          }),
        );
      } catch (exception) {
        if (exception instanceof DomainException) throw exception;
        if (exception instanceof TransactionCanceledException) {
          const { CancellationReasons } = exception;
          if (!CancellationReasons) throw exception;
          if (
            CancellationReasons[0].Code ===
            DynamoDBExceptionCode.CONDITIONAL_CHECK_FAILED
          )
            throw new VideoRearrangedException();
        }
        RETRIES++;
        if (RETRIES === MAX_RETRIES) throw exception;
        await TimerService.sleepWith1000MsBaseDelayExponentialBackoff(RETRIES);
      }
    }
  }

  private calculateNewVideoPosition(param: {
    upperVideo: VideoEntity | null;
    lowerVideo: VideoEntity | null;
  }): number {
    const { upperVideo, lowerVideo } = param;
    let newPosition: number | undefined = undefined;
    if (lowerVideo && upperVideo) {
      newPosition = Math.round((lowerVideo.videoId + upperVideo.videoId) / 2);
    }
    if (!lowerVideo && upperVideo) {
      newPosition = Math.round(upperVideo.videoId * 1.5);
    }
    if (!upperVideo && lowerVideo) {
      newPosition = Math.round(lowerVideo.videoId * 0.5);
    }
    if (!newPosition) {
      throw new DomainException('New position is not defined');
    }
    return newPosition;
  }

  public async deleteIfExistsOrThrow(param: {
    lessonId: number;
    videoId: number;
    domainException: DomainException;
  }): Promise<void> {
    const { lessonId, videoId, domainException } = param;
    let RETRIES: number = 0;
    const MAX_RETRIES: number = 25;
    while (RETRIES <= MAX_RETRIES) {
      try {
        const videoEntity: VideoEntity = await this.findByIdOrThrow({
          lessonId,
          videoId,
          domainException: new VideoNotFoundException(),
        });
        const courseEntity: CourseEntity =
          await this.courseDynamoDBRepository.findByIdOrThrow({
            courseId: videoEntity.courseId,
          });
        const lessonEntity: LessonEntity =
          await this.lessonDynamoDBRepository.findByIdOrThrow({
            courseId: videoEntity.courseId,
            lessonId,
          });
        await this.dynamoDBDocumentClient.send(
          new TransactWriteCommand({
            TransactItems: [
              {
                Delete: {
                  TableName: this.dynamoDBConfig.VIDEO_TABLE,
                  Key: new VideoKey({ lessonId, videoId }),
                  ConditionExpression:
                    'attribute_exists(lessonId) AND attribute_exists(videoId) AND #durationInSec = :value0',
                  ExpressionAttributeNames: {
                    '#durationInSec': 'durationInSec',
                  },
                  ExpressionAttributeValues: {
                    ':value0': videoEntity.durationInSec,
                  },
                },
              },
              {
                Update: {
                  TableName: this.dynamoDBConfig.LESSON_TABLE,
                  Key: new LessonKey({
                    courseId: videoEntity.courseId,
                    lessonId,
                  }),
                  ConditionExpression:
                    'attribute_exists(courseId) AND attribute_exists(lessonId) AND #version = :value0',
                  UpdateExpression:
                    'SET #numberOfVideos = :value1, #numberOfDurations = :value2',
                  ExpressionAttributeNames: {
                    '#version': 'version',
                    '#numberOfVideos': 'numberOfVideos',
                    '#numberOfDurations': 'numberOfDurations',
                  },
                  ExpressionAttributeValues: {
                    ':value0': lessonEntity.version,
                    ':value1': lessonEntity.numberOfVideos - 1,
                    ':value2':
                      lessonEntity.numberOfDurations -
                      videoEntity.durationInSec,
                  },
                },
              },
              {
                Update: {
                  TableName: this.dynamoDBConfig.COURSE_TABLE,
                  Key: new CourseKey({ courseId: videoEntity.courseId }),
                  ConditionExpression:
                    'attribute_exists(id) AND attribute_exists(courseId) AND #version = :value0',
                  UpdateExpression:
                    'SET #numberOfVideos = :value1, #numberOfDurations = :value2',
                  ExpressionAttributeNames: {
                    '#version': 'version',
                    '#numberOfVideos': 'numberOfVideos',
                    '#numberOfDurations': 'numberOfDurations',
                  },
                  ExpressionAttributeValues: {
                    ':value0': courseEntity.version,
                    ':value1': courseEntity.numberOfVideos - 1,
                    ':value2':
                      courseEntity.numberOfDurations -
                      videoEntity.durationInSec,
                  },
                },
              },
            ],
          }),
        );
        return;
      } catch (exception) {
        if (exception instanceof VideoNotFoundException) throw exception;
        if (exception instanceof CourseNotFoundException) throw exception;
        if (exception instanceof LessonNotFoundException) throw exception;
        if (exception instanceof TransactionCanceledException) {
          const { CancellationReasons } = exception;
          if (!CancellationReasons) throw exception;
          if (
            CancellationReasons[1].Code ===
            DynamoDBExceptionCode.CONDITIONAL_CHECK_FAILED
          )
            throw new LessonNotFoundException();
          if (
            CancellationReasons[1].Code ===
            DynamoDBExceptionCode.CONDITIONAL_CHECK_FAILED
          )
            throw new CourseNotFoundException();
        }
        RETRIES++;
        if (RETRIES == MAX_RETRIES) {
          throw exception;
        }
      }
    }
  }
}
