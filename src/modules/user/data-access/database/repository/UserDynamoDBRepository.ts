import { Inject, Injectable } from '@nestjs/common';
import DynamoDBConfig from '../../../../../config/DynamoDBConfig';
import UserEntity from '../entity/UserEntity';
import DomainException from '../../../../../common/common-domain/exception/DomainException';
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import {
  ConditionalCheckFailedException,
  TransactionCanceledException,
} from '@aws-sdk/client-dynamodb';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import DynamoDBBuilder from '../../../../../common/common-data-access/UpdateBuilder';
import { DependencyInjection } from '../../../../../common/common-domain/DependencyInjection';
import UniqueEmailKey from '../entity/UniqueEmailKey';
import UserKey from '../entity/UserKey';

@Injectable()
export default class UserDynamoDBRepository {
  constructor(
    @Inject(DependencyInjection.DYNAMODB_DOCUMENT_CLIENT)
    private readonly dynamoDBDocumentClient: DynamoDBDocumentClient,
    private readonly dynamoDBConfig: DynamoDBConfig,
  ) {}

  public async saveIfEmailNotTakenOrThrow(param: {
    userEntity: UserEntity;
    domainException: DomainException;
  }): Promise<void> {
    const { userEntity, domainException } = param;
    try {
      await this.dynamoDBDocumentClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Put: {
                TableName: this.dynamoDBConfig.USER_TABLE,
                Item: { ...userEntity, id: 'USER' },
                ConditionExpression:
                  'attribute_not_exists(id) AND attribute_not_exists(userId)',
              },
            },
            {
              Put: {
                TableName: this.dynamoDBConfig.USER_TABLE,
                Item: new UniqueEmailKey({
                  email: userEntity.email,
                  userId: userEntity.userId,
                }),
                ConditionExpression:
                  'attribute_not_exists(id) AND attribute_not_exists(userId)',
              },
            },
          ],
        }),
      );
    } catch (exception) {
      if (exception instanceof TransactionCanceledException) {
        throw domainException;
      }
      throw exception;
    }
  }

  public async findByIdOrThrow(param: {
    userId: number;
    domainException: DomainException;
  }): Promise<UserEntity> {
    const { userId, domainException } = param;
    const response = await this.dynamoDBDocumentClient.send(
      new GetCommand({
        TableName: this.dynamoDBConfig.USER_TABLE,
        Key: new UserKey({ userId }),
      }),
    );
    if (!response.Item) {
      throw domainException;
    }
    return strictPlainToClass(UserEntity, response.Item);
  }

  public async findByEmailOrThrow(param: {
    email: string;
    domainException: DomainException;
  }): Promise<{ userId: number }> {
    const { email, domainException } = param;
    const response = await this.dynamoDBDocumentClient.send(
      new QueryCommand({
        TableName: this.dynamoDBConfig.USER_TABLE,
        KeyConditionExpression: '#id = :value0',
        ExpressionAttributeNames: {
          '#id': 'id',
        },
        ExpressionAttributeValues: {
          ':value0': email,
        },
        Limit: 1,
      }),
    );
    if (!response.Items || response.Items.length === 0) {
      throw domainException;
    }
    return {
      userId: response.Items[0].userId,
    };
  }

  public async saveIfExistsOrThrow(param: {
    userEntity: UserEntity;
    domainException: DomainException;
  }): Promise<void> {
    const { userEntity, domainException } = param;
    try {
      const { userId, ...restObj } = userEntity;
      const updateObj = DynamoDBBuilder.buildUpdate(restObj);
      if (!updateObj) return;
      await this.dynamoDBDocumentClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Update: {
                TableName: this.dynamoDBConfig.USER_TABLE,
                Key: new UserKey({ userId }),
                ...updateObj,
                ConditionExpression:
                  'attribute_exists(id) AND attribute_exists(userId)',
              },
            },
            {
              Put: {
                TableName: this.dynamoDBConfig.USER_TABLE,
                Item: new UniqueEmailKey({ email: userEntity.email, userId }),
                ConditionExpression:
                  'attribute_exists(id) AND attribute_exists(userId)',
              },
            },
          ],
        }),
      );
    } catch (exception) {
      if (exception instanceof ConditionalCheckFailedException) {
        throw domainException;
      }
    }
  }
}
