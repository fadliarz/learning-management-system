import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../common/common-domain/DependencyInjection';
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import DynamoDBConfig from '../../../../../config/DynamoDBConfig';
import PrivilegeEntity from '../entity/PrivilegeEntity';
import { Permission } from '../../../domain/domain-core/entity/Permission';
import DomainException from '../../../../../common/common-domain/exception/DomainException';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import { TransactionCanceledException } from '@aws-sdk/client-dynamodb';
import UserKey from '../../../../user/data-access/database/entity/UserKey';
import PrivilegeKey from '../entity/PrivilegeKey';
import { DynamoDBExceptionCode } from '../../../../../common/common-domain/DynamoDBExceptionCode';
import UserNotFoundException from '../../../../user/domain/domain-core/exception/UserNotFoundException';

@Injectable()
export default class PrivilegeDynamoDBRepository {
  constructor(
    @Inject(DependencyInjection.DYNAMODB_DOCUMENT_CLIENT)
    private readonly dynamoDBDocumentClient: DynamoDBDocumentClient,
    private readonly dynamoDBConfig: DynamoDBConfig,
  ) {}

  public async saveIfNotExistsOrIgnore(param: {
    privilegeEntity: PrivilegeEntity;
  }): Promise<void> {
    const { privilegeEntity } = param;
    try {
      await this.dynamoDBDocumentClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Put: {
                TableName: this.dynamoDBConfig.PRIVILEGE_TABLE,
                Item: privilegeEntity,
                ConditionExpression:
                  'attribute_not_exists(userId) AND attribute_not_exists(#permission)',
                ExpressionAttributeNames: {
                  '#permission': 'permission',
                },
              },
            },
            {
              Update: {
                TableName: this.dynamoDBConfig.USER_TABLE,
                Key: new UserKey({ userId: privilegeEntity.userId }),
                ConditionExpression:
                  'attribute_exists(id) AND attribute_exists(userId)',
                UpdateExpression: 'ADD #permissions :value0',
                ExpressionAttributeNames: {
                  '#permissions': 'permissions',
                },
                ExpressionAttributeValues: {
                  ':value0': new Set([privilegeEntity.permission]),
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
          return;
        if (
          CancellationReasons[1].Code ===
          DynamoDBExceptionCode.CONDITIONAL_CHECK_FAILED
        )
          throw new UserNotFoundException();
      }
      throw exception;
    }
  }

  public async findMany(param: { userId: number }): Promise<PrivilegeEntity[]> {
    const { userId } = param;
    const result = await this.dynamoDBDocumentClient.send(
      new QueryCommand({
        TableName: this.dynamoDBConfig.PRIVILEGE_TABLE,
        KeyConditionExpression: '#userId = :value0',
        ExpressionAttributeNames: {
          '#userId': 'userId',
        },
        ExpressionAttributeValues: {
          ':value0': userId,
        },
      }),
    );
    if (!result.Items) return [];
    return result.Items.map((item) =>
      strictPlainToClass(PrivilegeEntity, item),
    );
  }

  public async findByIdOrThrow(param: {
    userId: number;
    permission: Permission;
    domainException: DomainException;
  }): Promise<PrivilegeEntity> {
    const { userId, permission, domainException } = param;
    const result = await this.dynamoDBDocumentClient.send(
      new GetCommand({
        TableName: this.dynamoDBConfig.PRIVILEGE_TABLE,
        Key: new PrivilegeKey({ userId, permission }),
      }),
    );
    if (!result.Item) throw domainException;
    return strictPlainToClass(PrivilegeEntity, result.Item);
  }

  public async deleteIfExistsOrIgnore(param: {
    userId: number;
    permission: Permission;
  }): Promise<void> {
    const { userId, permission } = param;
    try {
      await this.dynamoDBDocumentClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Delete: {
                TableName: this.dynamoDBConfig.PRIVILEGE_TABLE,
                Key: new PrivilegeKey({ userId, permission }),
                ConditionExpression:
                  'attribute_exists(userId) AND attribute_exists(#permission)',
                ExpressionAttributeNames: {
                  '#permission': 'permission',
                },
              },
            },
            {
              Update: {
                TableName: this.dynamoDBConfig.USER_TABLE,
                Key: new UserKey({ userId }),
                ConditionExpression:
                  'attribute_exists(id) AND attribute_exists(userId)',
                UpdateExpression: 'DELETE #permissions :value0',
                ExpressionAttributeNames: {
                  '#permissions': 'permissions',
                },
                ExpressionAttributeValues: {
                  ':value0': new Set([permission]),
                },
              },
            },
          ],
        }),
      );
    } catch (exception) {
      console.log(exception);
      if (exception instanceof TransactionCanceledException) {
        const { CancellationReasons } = exception;
        if (!CancellationReasons) throw exception;
        if (
          CancellationReasons[0].Code ===
          DynamoDBExceptionCode.CONDITIONAL_CHECK_FAILED
        )
          return;
        if (
          CancellationReasons[1].Code ===
          DynamoDBExceptionCode.CONDITIONAL_CHECK_FAILED
        )
          throw new UserNotFoundException();
      }
      throw exception;
    }
  }
}
