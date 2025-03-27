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
import CategoryEntity from '../entity/CategoryEntity';
import { TransactionCanceledException } from '@aws-sdk/client-dynamodb';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import CategoryNotFoundException from '../../../domain/domain-core/exception/CategoryNotFoundException';
import TimerService from '../../../../../common/common-domain/TimerService';
import CategoryKey from '../entity/CategoryKey';
import UniqueCategoryKey from '../entity/UniqueCategoryKey';
import Pagination from '../../../../../common/common-domain/repository/Pagination';

@Injectable()
export default class CategoryDynamoDBRepository {
  private readonly BACKOFF_IN_MS: number = 300;

  constructor(
    @Inject(DependencyInjection.DYNAMODB_DOCUMENT_CLIENT)
    private readonly dynamoDBDocumentClient: DynamoDBDocumentClient,
    private readonly dynamoDBConfig: DynamoDBConfig,
  ) {}

  public async saveIfNotExistsOrThrow(param: {
    categoryEntity: CategoryEntity;
    domainException: DomainException;
  }): Promise<void> {
    const { categoryEntity, domainException } = param;
    try {
      await this.dynamoDBDocumentClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Put: {
                TableName: this.dynamoDBConfig.CATEGORY_TABLE,
                ConditionExpression:
                  'attribute_not_exists(id) AND attribute_not_exists(categoryId)',
                Item: { ...categoryEntity, id: 'CATEGORY' },
              },
            },
            {
              Put: {
                TableName: this.dynamoDBConfig.CATEGORY_TABLE,
                Item: new UniqueCategoryKey({ title: categoryEntity.title }),
                ConditionExpression:
                  'attribute_not_exists(id) AND attribute_not_exists(categoryId)',
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

  public async findMany(param: {
    pagination: Pagination;
  }): Promise<CategoryEntity[]> {
    const { pagination } = param;
    const categoryEntities: CategoryEntity[] = [];
    let lastEvaluatedKey: Record<string, any> | undefined = undefined;
    let limit: number | undefined = pagination.limit;
    do {
      const { Items, LastEvaluatedKey } =
        await this.dynamoDBDocumentClient.send(
          new QueryCommand({
            TableName: this.dynamoDBConfig.CATEGORY_TABLE,
            KeyConditionExpression: pagination.lastEvaluatedId
              ? '#id = :value0 AND categoryId < :value1'
              : '#id = :value0',
            ExpressionAttributeNames: {
              '#id': 'id',
            },
            ExpressionAttributeValues: {
              ':value0': 'CATEGORY',
              ...(pagination.lastEvaluatedId
                ? { ':value1': pagination.lastEvaluatedId }
                : {}),
            },
            ExclusiveStartKey: lastEvaluatedKey,
            Limit: limit,
          }),
        );
      if (Items) {
        categoryEntities.push(
          ...Items.map((item) => strictPlainToClass(CategoryEntity, item)),
        );
      }
      lastEvaluatedKey = LastEvaluatedKey as Record<string, any> | undefined;
      if (limit) {
        limit = pagination.limit - categoryEntities.length;
      }
    } while (lastEvaluatedKey);
    return categoryEntities;
  }

  public async findByIdOrThrow(param: {
    categoryId: number;
    domainException: DomainException;
  }): Promise<CategoryEntity> {
    const { categoryId, domainException } = param;
    const response = await this.dynamoDBDocumentClient.send(
      new GetCommand({
        TableName: this.dynamoDBConfig.CATEGORY_TABLE,
        Key: new CategoryKey({ categoryId }),
      }),
    );
    if (!response.Item) {
      throw domainException;
    }
    return strictPlainToClass(CategoryEntity, response.Item);
  }

  public async saveIfExistsOrThrow(param: {
    categoryEntity: CategoryEntity;
    domainException: DomainException;
  }): Promise<void> {
    const { categoryEntity, domainException } = param;
    let RETRIES: number = 0;
    const MAX_RETRIES = 5;
    while (RETRIES < MAX_RETRIES) {
      try {
        const oldCategoryEntity: CategoryEntity = await this.findByIdOrThrow({
          categoryId: categoryEntity.categoryId,
          domainException: new CategoryNotFoundException(),
        });
        await this.dynamoDBDocumentClient.send(
          new TransactWriteCommand({
            TransactItems: [
              {
                Update: {
                  TableName: this.dynamoDBConfig.CATEGORY_TABLE,
                  Key: new CategoryKey({
                    categoryId: categoryEntity.categoryId,
                  }),
                  ConditionExpression:
                    'attribute_exists(categoryId) AND #title = :value0',
                  UpdateExpression: 'SET #title = :value1',
                  ExpressionAttributeNames: {
                    '#title': 'title',
                  },
                  ExpressionAttributeValues: {
                    ':value0': oldCategoryEntity.title,
                    ':value1': categoryEntity.title,
                  },
                },
              },
              {
                Put: {
                  TableName: this.dynamoDBConfig.CATEGORY_TABLE,
                  ConditionExpression: 'attribute_not_exists(categoryId)',
                  Item: { id: 'CATEGORY#' + categoryEntity.title },
                },
              },
              {
                Delete: {
                  TableName: this.dynamoDBConfig.CATEGORY_TABLE,
                  ConditionExpression: 'attribute_exists(categoryId)',
                  Key: { categoryId: 'CATEGORY#' + oldCategoryEntity.title },
                },
              },
            ],
          }),
        );
      } catch (exception) {
        if (exception instanceof CategoryNotFoundException) throw exception;
        RETRIES++;
        if (RETRIES === MAX_RETRIES) {
          throw exception instanceof TransactionCanceledException
            ? domainException
            : exception;
        }
        await TimerService.sleepInMilliseconds(this.BACKOFF_IN_MS);
      }
    }
  }

  public async deleteIfExistsOrThrow(param: {
    categoryId: number;
    domainException: DomainException;
  }): Promise<void> {
    const { categoryId, domainException } = param;
    let RETRIES: number = 0;
    const MAX_RETRIES: number = 5;
    while (RETRIES < MAX_RETRIES) {
      try {
        const categoryEntity: CategoryEntity = await this.findByIdOrThrow({
          categoryId,
          domainException: new CategoryNotFoundException(),
        });
        await this.dynamoDBDocumentClient.send(
          new TransactWriteCommand({
            TransactItems: [
              {
                Delete: {
                  TableName: this.dynamoDBConfig.CATEGORY_TABLE,
                  Key: new CategoryKey({ categoryId }),
                  ConditionExpression:
                    'attribute_exists(categoryId) AND #title = :value0',
                  ExpressionAttributeNames: {
                    '#title': 'title',
                  },
                  ExpressionAttributeValues: {
                    ':value0': categoryEntity.title,
                  },
                },
              },
              {
                Delete: {
                  TableName: this.dynamoDBConfig.CATEGORY_TABLE,
                  Key: { categoryId: 'CATEGORY#' + categoryEntity.title },
                  ConditionExpression: 'attribute_exists(categoryId)',
                },
              },
            ],
          }),
        );
      } catch (exception) {
        if (exception instanceof CategoryNotFoundException) throw exception;
        RETRIES++;
        if (RETRIES === MAX_RETRIES) {
          throw exception instanceof TransactionCanceledException
            ? domainException
            : exception;
        }
      }
    }
  }
}
