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

@Injectable()
export default class TagDynamoDBRepository {
  constructor(
    @Inject(DependencyInjection.DYNAMODB_DOCUMENT_CLIENT)
    private readonly dynamoDBDocumentClient: DynamoDBDocumentClient,
    private readonly dynamoDBConfig: DynamoDBConfig,
  ) {}

  public async saveIfNotExistsOrThrow(param: {
    tagEntity: TagEntity;
    domainException: DomainException;
  }): Promise<void> {
    const { tagEntity, domainException } = param;
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
        if (!CancellationReasons) throw exception;
        if (
          CancellationReasons[0].Code ===
          DynamoDBExceptionCode.CONDITIONAL_CHECK_FAILED
        )
          throw new DomainException();
        if (
          CancellationReasons[1].Code ===
          DynamoDBExceptionCode.CONDITIONAL_CHECK_FAILED
        )
          throw new TagTitleAlreadyExistsException();
      }
      throw domainException;
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

  public async findByIdOrThrow(param: {
    tagId: number;
    domainException: DomainException;
  }): Promise<TagEntity> {
    const { tagId, domainException } = param;
    const response = await this.dynamoDBDocumentClient.send(
      new GetCommand({
        TableName: this.dynamoDBConfig.TAG_TABLE,
        Key: new TagKey({ tagId }),
      }),
    );
    if (!response.Item) {
      throw domainException;
    }
    return strictPlainToClass(TagEntity, response.Item);
  }

  public async saveIfExistsOrThrow(param: {
    tagEntity: TagEntity;
    domainException: DomainException;
  }): Promise<void> {
    const { tagEntity, domainException } = param;
    let RETRIES: number = 0;
    const MAX_RETRIES: number = 3;
    while (RETRIES <= MAX_RETRIES) {
      try {
        const oldTagEntity: TagEntity = await this.findByIdOrThrow({
          tagId: tagEntity.tagId,
          domainException: new TagNotFoundException(),
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
        if (exception instanceof TagNotFoundException) throw domainException;
        if (exception instanceof TransactionCanceledException) {
          const { CancellationReasons } = exception;
          if (!CancellationReasons) throw new DomainException();
          if (
            CancellationReasons[1].Code ===
            DynamoDBExceptionCode.CONDITIONAL_CHECK_FAILED
          )
            throw new TagTitleAlreadyExistsException();
        }
        RETRIES++;
        if (RETRIES === MAX_RETRIES) {
          throw exception;
        }
        await TimerService.sleepWith1000MsBaseDelayExponentialBackoff(RETRIES);
      }
    }
  }

  public async deleteIfExistsOrThrow(param: {
    tagId: number;
    domainException: DomainException;
  }): Promise<void> {
    const { tagId, domainException } = param;
    let RETRIES: number = 0;
    const MAX_RETRIES: number = 25;
    while (RETRIES <= MAX_RETRIES) {
      try {
        const tagEntity: TagEntity = await this.findByIdOrThrow({
          tagId,
          domainException: new TagNotFoundException(),
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
        if (exception instanceof TagNotFoundException) throw domainException;
        RETRIES++;
        if (RETRIES === MAX_RETRIES) {
          if (exception instanceof TransactionCanceledException)
            throw domainException;
          throw exception;
        }
        await TimerService.sleepWith1000MsBaseDelayExponentialBackoff(RETRIES);
      }
    }
  }
}
