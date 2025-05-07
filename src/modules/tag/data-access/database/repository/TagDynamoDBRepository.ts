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
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import TagNotFoundException from '../../../domain/domain-core/exception/TagNotFoundException';
import TimerService from '../../../../../common/common-domain/TimerService';
import Pagination from '../../../../../common/common-domain/repository/Pagination';
import TagTitleAlreadyExistsException from '../../../domain/domain-core/exception/TagTitleAlreadyExistsException';
import { DynamoDBExceptionCode } from '../../../../../common/common-domain/DynamoDBExceptionCode';
import TagEntity from '../entity/TagEntity';
import UniqueTagKey from '../entity/UniqueTagKey';
import TagKey from '../entity/TagKey';
import InternalServerException from '../../../../../common/common-domain/exception/InternalServerException';
import DuplicateKeyException from '../../../../../common/common-domain/exception/DuplicateKeyException';
import ResourceConflictException from '../../../../../common/common-domain/exception/ResourceConflictException';

@Injectable()
export default class TagDynamoDBRepository {
  constructor(
    @Inject(DependencyInjection.DYNAMODB_DOCUMENT_CLIENT)
    private readonly dynamoDBDocumentClient: DynamoDBDocumentClient,
    private readonly dynamoDBConfig: DynamoDBConfig,
  ) {}

  public async saveIfNotExistsOrThrow(param: {
    tagEntity: TagEntity;
  }): Promise<void> {
    const { tagEntity } = param;
    try {
      await this.dynamoDBDocumentClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Put: {
                TableName: this.dynamoDBConfig.TAG_TABLE,
                ConditionExpression:
                  'attribute_not_exists(id) AND attribute_not_exists(tagId)',
                Item: { ...tagEntity, id: 'TAG' },
              },
            },
            {
              Put: {
                TableName: this.dynamoDBConfig.TAG_TABLE,
                Item: new UniqueTagKey({ title: tagEntity.title }),
                ConditionExpression:
                  'attribute_not_exists(id) AND attribute_not_exists(tagId)',
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
          throw new DuplicateKeyException({ throwable: exception });
        if (
          CancellationReasons[1].Code ===
          DynamoDBExceptionCode.CONDITIONAL_CHECK_FAILED
        )
          throw new TagTitleAlreadyExistsException({ throwable: exception });
      }
      throw new InternalServerException({ throwable: exception });
    }
  }

  public async findMany(param: {
    pagination: Pagination;
  }): Promise<TagEntity[]> {
    const { pagination } = param;
    const tagEntities: TagEntity[] = [];
    let lastEvaluatedKey: Record<string, any> | undefined = undefined;
    let limit: number | undefined = pagination.limit;
    do {
      if (limit === 0) break;
      const { Items, LastEvaluatedKey } =
        await this.dynamoDBDocumentClient.send(
          new QueryCommand({
            TableName: this.dynamoDBConfig.TAG_TABLE,
            KeyConditionExpression: pagination.lastEvaluatedId
              ? '#id = :value0 AND tagId < :value1'
              : '#id = :value0',
            ExpressionAttributeNames: {
              '#id': 'id',
            },
            ExpressionAttributeValues: {
              ':value0': 'TAG',
              ...(pagination.lastEvaluatedId
                ? { ':value1': pagination.lastEvaluatedId }
                : {}),
            },
            ExclusiveStartKey: lastEvaluatedKey,
            Limit: limit,
          }),
        );
      if (Items) {
        tagEntities.push(
          ...Items.map((item) => strictPlainToClass(TagEntity, item)),
        );
      }
      lastEvaluatedKey = LastEvaluatedKey as Record<string, any> | undefined;
      if (limit) {
        limit = pagination.limit - tagEntities.length;
      }
    } while (lastEvaluatedKey);
    return tagEntities;
  }

  public async findByIdOrThrow(param: { tagId: number }): Promise<TagEntity> {
    const { tagId } = param;
    const response = await this.dynamoDBDocumentClient.send(
      new GetCommand({
        TableName: this.dynamoDBConfig.TAG_TABLE,
        Key: new TagKey({ tagId }),
      }),
    );
    if (!response.Item) {
      throw new TagNotFoundException();
    }
    return strictPlainToClass(TagEntity, response.Item);
  }

  public async saveIfExistsOrThrow(param: {
    tagEntity: TagEntity;
  }): Promise<void> {
    const { tagEntity } = param;
    let RETRIES: number = 0;
    const MAX_RETRIES: number = 5;
    while (RETRIES <= MAX_RETRIES) {
      try {
        const oldTagEntity: TagEntity = await this.findByIdOrThrow({
          tagId: tagEntity.tagId,
        });
        if (tagEntity.title === oldTagEntity.title) return;
        await this.dynamoDBDocumentClient.send(
          new TransactWriteCommand({
            TransactItems: [
              {
                Update: {
                  TableName: this.dynamoDBConfig.TAG_TABLE,
                  Key: new TagKey({
                    tagId: tagEntity.tagId,
                  }),
                  ConditionExpression:
                    'attribute_exists(id) AND attribute_exists(tagId) AND #title = :value0',
                  UpdateExpression: 'SET #title = :value1',
                  ExpressionAttributeNames: {
                    '#title': 'title',
                  },
                  ExpressionAttributeValues: {
                    ':value0': oldTagEntity.title,
                    ':value1': tagEntity.title,
                  },
                },
              },
              {
                Put: {
                  TableName: this.dynamoDBConfig.TAG_TABLE,
                  ConditionExpression:
                    'attribute_not_exists(id) AND attribute_not_exists(tagId)',
                  Item: new UniqueTagKey({ title: tagEntity.title }),
                },
              },
              {
                Delete: {
                  TableName: this.dynamoDBConfig.TAG_TABLE,
                  Key: new UniqueTagKey({
                    title: oldTagEntity.title,
                  }),
                  ConditionExpression:
                    'attribute_exists(id) AND attribute_exists(tagId)',
                },
              },
            ],
          }),
        );
        return;
      } catch (exception) {
        if (exception instanceof TagNotFoundException) throw exception;
        if (exception instanceof TransactionCanceledException) {
          const { CancellationReasons } = exception;
          if (!CancellationReasons)
            throw new InternalServerException({ throwable: exception });
          if (
            CancellationReasons[1].Code ===
            DynamoDBExceptionCode.CONDITIONAL_CHECK_FAILED
          )
            throw new TagTitleAlreadyExistsException();
        }
        RETRIES++;
        if (RETRIES > MAX_RETRIES) {
          throw new ResourceConflictException({ throwable: exception });
        }
        await TimerService.sleepWith100MsBaseDelayExponentialBackoff(RETRIES);
      }
    }
  }

  public async deleteIfExistsOrThrow(param: { tagId: number }): Promise<void> {
    const { tagId } = param;
    let RETRIES: number = 0;
    const MAX_RETRIES: number = 5;
    while (RETRIES <= MAX_RETRIES) {
      try {
        const tagEntity: TagEntity = await this.findByIdOrThrow({
          tagId,
        });
        await this.dynamoDBDocumentClient.send(
          new TransactWriteCommand({
            TransactItems: [
              {
                Delete: {
                  TableName: this.dynamoDBConfig.TAG_TABLE,
                  Key: new TagKey({ tagId }),
                  ConditionExpression:
                    'attribute_exists(id) AND attribute_exists(tagId) AND #title = :value0',
                  ExpressionAttributeNames: {
                    '#title': 'title',
                  },
                  ExpressionAttributeValues: {
                    ':value0': tagEntity.title,
                  },
                },
              },
              {
                Delete: {
                  TableName: this.dynamoDBConfig.TAG_TABLE,
                  Key: new UniqueTagKey({ title: tagEntity.title }),
                  ConditionExpression:
                    'attribute_exists(id) AND attribute_exists(tagId)',
                },
              },
            ],
          }),
        );
        return;
      } catch (exception) {
        if (exception instanceof TagNotFoundException) return;
        RETRIES++;
        if (RETRIES > MAX_RETRIES) {
          throw new ResourceConflictException({ throwable: exception });
        }
        await TimerService.sleepWith100MsBaseDelayExponentialBackoff(RETRIES);
      }
    }
  }
}
