import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../common/common-domain/DependencyInjection';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import DynamoDBConfig from '../../../../../config/DynamoDBConfig';
import DomainException from '../../../../../common/common-domain/exception/DomainException';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import DynamoDBBuilder from '../../../../../common/common-data-access/UpdateBuilder';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import UserAssignmentEntity from '../entity/UserAssignmentEntity';
import { AssignmentType } from '../../../domain/domain-core/entity/AssignmentType';
import Pagination from '../../../../../common/common-domain/repository/Pagination';
import UserAssignmentKey from '../entity/UserAssignmentKey';

@Injectable()
export default class UserAssignmentDynamoDBRepository {
  constructor(
    @Inject(DependencyInjection.DYNAMODB_DOCUMENT_CLIENT)
    private readonly dynamoDBDocumentClient: DynamoDBDocumentClient,
    private readonly dynamoDBConfig: DynamoDBConfig,
  ) {}

  public async saveIfNotExistsOrThrow(param: {
    userAssignmentEntity: UserAssignmentEntity;
    domainException: DomainException;
  }): Promise<void> {
    const { userAssignmentEntity, domainException } = param;
    try {
      await this.dynamoDBDocumentClient.send(
        new PutCommand({
          TableName: this.dynamoDBConfig.USER_ASSIGNMENT_TABLE,
          Item: userAssignmentEntity,
          ConditionExpression:
            'attribute_not_exists(userId) AND attribute_not_exists(assignmentId)',
        }),
      );
    } catch (exception) {
      throw exception instanceof ConditionalCheckFailedException
        ? domainException
        : exception;
    }
  }

  public async findMany(param: {
    userId: number;
    pagination: Pagination;
  }): Promise<UserAssignmentEntity[]> {
    const { userId, pagination } = param;
    const userAssignmentEntities: UserAssignmentEntity[] = [];
    let lastEvaluatedKey: Record<string, any> | undefined = undefined;
    let limit: number | undefined = pagination.limit;
    do {
      const { Items, LastEvaluatedKey } =
        await this.dynamoDBDocumentClient.send(
          new QueryCommand({
            TableName: this.dynamoDBConfig.CLASS_TABLE,
            KeyConditionExpression: pagination.lastEvaluatedId
              ? '#userId = :value0 AND assignmentId < :value1'
              : '#userId = :value0',
            ExpressionAttributeNames: {
              '#userId': 'userId',
            },
            ExpressionAttributeValues: {
              ':value0': userId,
              ...(pagination.lastEvaluatedId
                ? { ':value1': pagination.lastEvaluatedId }
                : {}),
            },
            ExclusiveStartKey: lastEvaluatedKey,
            Limit: limit,
          }),
        );
      if (Items) {
        userAssignmentEntities.push(
          ...Items.map((item) =>
            strictPlainToClass(UserAssignmentEntity, item),
          ),
        );
      }
      lastEvaluatedKey = LastEvaluatedKey as Record<string, any> | undefined;
      if (limit) {
        limit = pagination.limit - userAssignmentEntities.length;
      }
    } while (lastEvaluatedKey);
    return userAssignmentEntities;
  }

  public async findByIdOrThrow(param: {
    userId: number;
    assignmentId: number;
    domainException: DomainException;
  }): Promise<UserAssignmentEntity> {
    const { userId, assignmentId, domainException } = param;
    const response = await this.dynamoDBDocumentClient.send(
      new GetCommand({
        TableName: this.dynamoDBConfig.USER_ASSIGNMENT_TABLE,
        Key: new UserAssignmentKey({ userId, assignmentId }),
      }),
    );
    if (!response.Item) {
      throw domainException;
    }
    return strictPlainToClass(UserAssignmentEntity, response.Item);
  }

  public async saveIfExistsAndAssignmentIsPersonalOrThrow(param: {
    userAssignmentEntity: UserAssignmentEntity;
    notFoundException: DomainException;
    domainException: DomainException;
  }): Promise<void> {
    const { userAssignmentEntity, notFoundException, domainException } = param;
    try {
      const { userId, assignmentId, ...restObj } = userAssignmentEntity;
      await this.dynamoDBDocumentClient.send(
        new UpdateCommand({
          TableName: this.dynamoDBConfig.USER_ASSIGNMENT_TABLE,
          Key: new UserAssignmentKey({ userId, assignmentId }),
          ...DynamoDBBuilder.buildUpdate(restObj),
          ConditionExpression:
            'attribute_exists(userId) AND attribute_exists(assignmentId) AND #assignmentType = :value0',
          ExpressionAttributeNames: {
            '#assignmentType': 'assignmentType',
          },
          ExpressionAttributeValues: {
            ':value0': AssignmentType.PERSONAL_ASSIGNMENT,
          },
        }),
      );
    } catch (exception) {
      if (exception instanceof ConditionalCheckFailedException) {
        const existingAssignment = await this.findByIdOrThrow({
          userId: userAssignmentEntity.userId,
          assignmentId: userAssignmentEntity.assignmentId,
          domainException: notFoundException,
        });
        if (
          existingAssignment.assignmentType !==
          AssignmentType.PERSONAL_ASSIGNMENT
        )
          throw domainException;
      }
      throw exception;
    }
  }

  public async deleteIfExistsAndAssignmentIsPersonalOrThrow(param: {
    userId: number;
    assignmentId: number;
    notFoundException: DomainException;
    domainException: DomainException;
  }): Promise<void> {
    const { userId, assignmentId, notFoundException, domainException } = param;
    try {
      await this.dynamoDBDocumentClient.send(
        new DeleteCommand({
          TableName: this.dynamoDBConfig.USER_ASSIGNMENT_TABLE,
          Key: new UserAssignmentKey({ userId, assignmentId }),
          ConditionExpression:
            'attribute_exists(userId) AND attribute_exists(assignmentId) AND #assignmentType = :value0',
          ExpressionAttributeNames: {
            '#assignmentType': 'assignmentType',
          },
          ExpressionAttributeValues: {
            ':value0': AssignmentType.PERSONAL_ASSIGNMENT,
          },
        }),
      );
    } catch (exception) {
      if (exception instanceof ConditionalCheckFailedException) {
        const existingAssignment = await this.findByIdOrThrow({
          userId,
          assignmentId,
          domainException: notFoundException,
        });
        if (
          existingAssignment.assignmentType !==
          AssignmentType.PERSONAL_ASSIGNMENT
        )
          throw domainException;
      }
      throw exception;
    }
  }
}
