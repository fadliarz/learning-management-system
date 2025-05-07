import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../common/common-domain/DependencyInjection';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
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
import ScholarshipEntity from '../entity/ScholarshipEntity';
import ScholarshipKey from '../entity/ScholarshipKey';
import ScholarshipNotFoundException from '../../../domain/domain-core/exception/ScholarshipNotFoundException';
import Pagination from '../../../../../common/common-domain/repository/Pagination';
import { DynamoDBExceptionCode } from '../../../../../common/common-domain/DynamoDBExceptionCode';
import TagLinkKey from '../../../../tag/data-access/database/entity/TagLinkKey';
import InternalServerException from '../../../../../common/common-domain/exception/InternalServerException';

@Injectable()
export default class ScholarshipDynamoDBRepository {
  constructor(
    @Inject(DependencyInjection.DYNAMODB_DOCUMENT_CLIENT)
    private readonly dynamoDBDocumentClient: DynamoDBDocumentClient,
    private readonly dynamoDBConfig: DynamoDBConfig,
  ) {}

  public async saveIfNotExistsOrThrow(param: {
    scholarshipEntity: ScholarshipEntity;
    domainException: DomainException;
  }): Promise<void> {
    const { scholarshipEntity } = param;
    await this.dynamoDBDocumentClient.send(
      new PutCommand({
        TableName: this.dynamoDBConfig.SCHOLARSHIP_TABLE,
        Item: { ...scholarshipEntity, id: 'SCHOLARSHIP' },
        ConditionExpression:
          'attribute_not_exists(id) AND attribute_not_exists(scholarshipId)',
      }),
    );
  }

  public async addTagIfNotExistsOrIgnore(param: {
    scholarshipId: number;
    tagId: number;
  }): Promise<void> {
    const { scholarshipId, tagId } = param;
    try {
      await this.dynamoDBDocumentClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Update: {
                TableName: this.dynamoDBConfig.SCHOLARSHIP_TABLE,
                Key: new ScholarshipKey({ scholarshipId }),
                ConditionExpression:
                  'attribute_exists(id) AND attribute_exists(scholarshipId)',
                UpdateExpression: 'ADD #tags :tagId',
                ExpressionAttributeNames: {
                  '#tags': 'tags',
                },
                ExpressionAttributeValues: {
                  ':tagId': new Set([tagId]),
                },
              },
            },
            {
              Put: {
                TableName: this.dynamoDBConfig.TAG_TABLE,
                Item: new TagLinkKey({ tagId, scholarshipId }),
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
          throw new ScholarshipNotFoundException({ throwable: exception });
      }
      throw new InternalServerException({ throwable: exception });
    }
  }

  public async removeTagIfExistsOrIgnore(param: {
    scholarshipId: number;
    tagId: number;
  }): Promise<void> {
    const { scholarshipId, tagId } = param;
    try {
      await this.dynamoDBDocumentClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Update: {
                TableName: this.dynamoDBConfig.SCHOLARSHIP_TABLE,
                Key: new ScholarshipKey({ scholarshipId }),
                ConditionExpression:
                  'attribute_exists(id) AND attribute_exists(scholarshipId)',
                UpdateExpression: 'DELETE #tags :tagId',
                ExpressionAttributeNames: {
                  '#tags': 'tags',
                },
                ExpressionAttributeValues: {
                  ':tagId': new Set([tagId]),
                },
              },
            },
            {
              Delete: {
                TableName: this.dynamoDBConfig.TAG_TABLE,
                Key: new TagLinkKey({ tagId, scholarshipId }),
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
          throw new ScholarshipNotFoundException({ throwable: exception });
      }
      throw new InternalServerException({ throwable: exception });
    }
  }

  public async findMany(param: {
    pagination: Pagination;
  }): Promise<ScholarshipEntity[]> {
    const { pagination } = param;
    const scholarshipEntities: ScholarshipEntity[] = [];
    let lastEvaluatedKey: Record<string, any> | undefined = undefined;
    let limit: number | undefined = pagination.limit;
    do {
      if (limit === 0) break;
      const { Items, LastEvaluatedKey } =
        await this.dynamoDBDocumentClient.send(
          new QueryCommand({
            TableName: this.dynamoDBConfig.SCHOLARSHIP_TABLE,
            KeyConditionExpression: pagination.lastEvaluatedId
              ? '#id = :value0 AND scholarshipId < :value1'
              : '#id = :value0',
            ExpressionAttributeNames: {
              '#id': 'id',
            },
            ExpressionAttributeValues: {
              ':value0': 'SCHOLARSHIP',
              ...(pagination.lastEvaluatedId
                ? { ':value1': pagination.lastEvaluatedId }
                : {}),
            },
            ExclusiveStartKey: lastEvaluatedKey,
            Limit: limit,
          }),
        );
      if (Items) {
        scholarshipEntities.push(
          ...Items.map((item) => strictPlainToClass(ScholarshipEntity, item)),
        );
      }
      lastEvaluatedKey = LastEvaluatedKey as Record<string, any> | undefined;
      if (limit) {
        limit = pagination.limit - scholarshipEntities.length;
      }
    } while (lastEvaluatedKey);
    return scholarshipEntities;
  }

  public async findByIdOrThrow(param: {
    scholarshipId: number;
    domainException: DomainException;
  }): Promise<ScholarshipEntity> {
    const { scholarshipId, domainException } = param;
    const response = await this.dynamoDBDocumentClient.send(
      new GetCommand({
        TableName: this.dynamoDBConfig.SCHOLARSHIP_TABLE,
        Key: new ScholarshipKey({ scholarshipId }),
      }),
    );
    if (!response.Item) {
      throw domainException;
    }
    return strictPlainToClass(ScholarshipEntity, response.Item);
  }

  public async saveIfExistsOrThrow(param: {
    scholarshipEntity: ScholarshipEntity;
    domainException: DomainException;
  }): Promise<void> {
    const { scholarshipEntity, domainException } = param;
    try {
      const { scholarshipId, ...restObj } = scholarshipEntity;
      const updateObj = DynamoDBBuilder.buildUpdate(restObj);
      if (!updateObj) return;
      await this.dynamoDBDocumentClient.send(
        new UpdateCommand({
          TableName: this.dynamoDBConfig.SCHOLARSHIP_TABLE,
          Key: new ScholarshipKey({ scholarshipId }),
          ...updateObj,
          ConditionExpression:
            'attribute_exists(id) AND attribute_exists(scholarshipId)',
        }),
      );
    } catch (exception) {
      if (exception instanceof ConditionalCheckFailedException)
        throw new ScholarshipNotFoundException({ throwable: exception });
      throw new InternalServerException({ throwable: exception });
    }
  }

  public async deleteIfExistsOrThrow(param: {
    scholarshipId: number;
    domainException: DomainException;
  }): Promise<void> {
    const { scholarshipId, domainException } = param;
    try {
      await this.dynamoDBDocumentClient.send(
        new DeleteCommand({
          TableName: this.dynamoDBConfig.SCHOLARSHIP_TABLE,
          Key: new ScholarshipKey({ scholarshipId }),
          ConditionExpression:
            'attribute_exists(id) AND attribute_exists(scholarshipId)',
        }),
      );
    } catch (exception) {
      if (exception instanceof ConditionalCheckFailedException)
        throw new ScholarshipNotFoundException();
      throw exception;
    }
  }
}
