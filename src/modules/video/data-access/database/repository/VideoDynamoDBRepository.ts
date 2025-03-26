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
import {
  ConditionalCheckFailedException,
  TransactionCanceledException,
} from '@aws-sdk/client-dynamodb';
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

@Injectable()
export default class VideoDynamoDBRepository {
  private readonly POSITION_INCREMENT: number = 10000;
  private readonly BACKOFF_IN_MS: number = 300;

  constructor(
    @Inject(DependencyInjection.DYNAMODB_DOCUMENT_CLIENT)
    private readonly dynamoDBDocumentClient: DynamoDBDocumentClient,
    private readonly dynamoDBConfig: DynamoDBConfig,
    private readonly lessonDynamoDBRepository: LessonDynamoDBRepository,
  ) {}

  public async saveIfNotExistsOrThrow(param: {
    videoEntity: VideoEntity;
    domainException: DomainException;
  }): Promise<void> {
    const { videoEntity, domainException } = param;
    let RETRIES: number = 0;
    const MAX_RETRIES: number = 5;
    while (RETRIES < MAX_RETRIES) {
      try {
        const lessonEntity: LessonEntity =
          await this.lessonDynamoDBRepository.findByIdOrThrow({
            lessonId: videoEntity.lessonId,
            courseId: videoEntity.courseId,
            domainException: new LessonNotFoundException(),
          });
        videoEntity.position =
          lessonEntity.videoLastPosition + this.POSITION_INCREMENT;
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
                    'attribute_exists(courseId) AND attribute_exists(lessonId) AND #videoPositionVersion = :value2',
                  UpdateExpression:
                    'ADD #videoPositionVersion :value0, ADD #videoLastPosition :value1',
                  ExpressionAttributeNames: {
                    '#videoPositionVersion': 'videoPositionVersion',
                    '#videoLastPosition': 'videoLastPosition',
                  },
                  ExpressionAttributeValues: {
                    ':value0': 1,
                    ':value1': this.POSITION_INCREMENT,
                    ':value2': lessonEntity.videoPositionVersion,
                  },
                },
              },
            ],
          }),
        );
      } catch (exception) {
        if (exception instanceof LessonNotFoundException) throw exception;
        RETRIES++;
        if (RETRIES == MAX_RETRIES)
          throw exception instanceof TransactionCanceledException
            ? domainException
            : exception;
        await TimerService.sleepInMilliseconds(this.BACKOFF_IN_MS);
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
      const { Items, LastEvaluatedKey } =
        await this.dynamoDBDocumentClient.send(
          new QueryCommand({
            TableName: this.dynamoDBConfig.LESSON_TABLE,
            KeyConditionExpression: pagination.lastEvaluatedId
              ? '#lessonId = :value0 AND #videoId < :value1'
              : '#lessonId = :value0',
            ExpressionAttributeNames: {
              '#lessonId': 'lessonId',
              '#videoId': 'videoId',
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
    const MAX_RETRIES: number = 5;
    while (RETRIES < MAX_RETRIES) {
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
          await this.dynamoDBDocumentClient.send(
            new TransactWriteCommand({
              TransactItems: [
                {
                  Update: {
                    TableName: this.dynamoDBConfig.VIDEO_TABLE,
                    Key: new VideoKey({ lessonId, videoId }),
                    ...updateObj,
                    ConditionExpression:
                      'attribute_exists(lessonId) AND attribute_exists(videoId) AND #durationInSec = :value0',
                    ExpressionAttributeNames: {
                      '#durationInSec': 'durationInSec',
                    },
                    ExpressionAttributeValues: {
                      ':value0': oldVideoEntity.durationInSec,
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
                      'attribute_exists(courseId) AND attribute_exists(id)',
                    UpdateExpression: 'ADD #numberOfDurations :value0',
                    ExpressionAttributeNames: {
                      '#numberOfDurations': 'numberOfDurations',
                    },
                    ExpressionAttributeValues: {
                      ':value0':
                        videoEntity.durationInSec -
                        oldVideoEntity.durationInSec,
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
                      'attribute_exists(id) AND attribute_exists(courseId)',
                    UpdateExpression: 'ADD #numberOfDurations :value0',
                    ExpressionAttributeNames: {
                      '#numberOfDurations': 'numberOfDurations',
                    },
                    ExpressionAttributeValues: {
                      ':value0':
                        videoEntity.durationInSec -
                        oldVideoEntity.durationInSec,
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
      } catch (exception) {
        if (exception instanceof VideoNotFoundException) throw exception;
        RETRIES++;
        if (RETRIES === MAX_RETRIES) {
          throw exception instanceof ConditionalCheckFailedException
            ? domainException
            : exception;
        }
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
    const { video, upperVideo, lowerVideo, version, domainException } = param;
    const lessonId: number = video.lessonId;
    try {
      let newPosition: number | undefined = undefined;
      if (lowerVideo && upperVideo) {
        newPosition = Math.round(
          (lowerVideo.position + upperVideo.position) / 2,
        );
      }
      if (!lowerVideo && upperVideo) {
        newPosition = upperVideo.position + this.POSITION_INCREMENT;
      }
      if (!upperVideo && lowerVideo) {
        newPosition = lowerVideo.position - this.POSITION_INCREMENT;
      }
      if (!newPosition) {
        throw new DomainException('New position is not defined');
      }
      await this.dynamoDBDocumentClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Update: {
                TableName: this.dynamoDBConfig.VIDEO_TABLE,
                Key: new VideoKey({ lessonId, videoId: video.videoId }),
                ConditionExpression:
                  'attribute_exists(lessonId) AND attribute_exists(videoId)',
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
                TableName: this.dynamoDBConfig.LESSON_TABLE,
                Key: new LessonKey({ courseId: video.courseId, lessonId }),
                ConditionExpression:
                  'attribute_exists(courseId) AND attribute_exists(lessonId) AND #lessonPositionVersion = :value2',
                UpdateExpression:
                  'ADD #videoPositionVersion :value0, ADD #videoLastPosition :value1',
                ExpressionAttributeNames: {
                  '#videoPositionVersion': 'videoPositionVersion',
                  '#videoLastPosition': 'videoLastPosition',
                },
                ExpressionAttributeValues: {
                  ':value0': 1,
                  ':value1':
                    !lowerVideo && upperVideo ? this.POSITION_INCREMENT : 0,
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
    lessonId: number;
    videoId: number;
    domainException: DomainException;
  }): Promise<void> {
    const { lessonId, videoId, domainException } = param;
    let RETRIES: number = 0;
    const MAX_RETRIES: number = 5;
    while (RETRIES < MAX_RETRIES) {
      try {
        const videoEntity: VideoEntity = await this.findByIdOrThrow({
          lessonId,
          videoId,
          domainException: new VideoNotFoundException(),
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
                    'attribute_exists(courseId) AND attribute_exists(lessonId)',
                  UpdateExpression:
                    'ADD #numberOfVideos :value0 ADD #numberOfDurations :value1',
                  ExpressionAttributeNames: {
                    '#numberOfVideos': 'numberOfVideos',
                    '#numberOfDurations': 'numberOfDurations',
                  },
                  ExpressionAttributeValues: {
                    ':value0': -1,
                    ':value1': -videoEntity.durationInSec,
                  },
                },
              },
              {
                Update: {
                  TableName: this.dynamoDBConfig.COURSE_TABLE,
                  Key: new CourseKey({ courseId: videoEntity.courseId }),
                  ConditionExpression:
                    'attribute_exists(id) AND attribute_exists(courseId)',
                  UpdateExpression:
                    'ADD #numberOfVideos :value0 ADD #numberOfDurations :value1',
                  ExpressionAttributeNames: {
                    '#numberOfVideos': 'numberOfVideos',
                    '#numberOfDurations': 'numberOfDurations',
                  },
                  ExpressionAttributeValues: {
                    ':value0': -1,
                    ':value1': -videoEntity.durationInSec,
                  },
                },
              },
            ],
          }),
        );
      } catch (exception) {
        if (exception instanceof VideoNotFoundException) throw exception;
        RETRIES++;
        if (RETRIES == MAX_RETRIES) {
          throw exception instanceof TransactionCanceledException
            ? domainException
            : exception;
        }
      }
    }
  }
}
