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
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import DynamoDBBuilder from '../../../../../common/common-data-access/UpdateBuilder';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import UserAssignmentEntity from '../entity/UserAssignmentEntity';
import { AssignmentType } from '../../../domain/domain-core/entity/AssignmentType';
import Pagination from '../../../../../common/common-domain/repository/Pagination';
import UserAssignmentKey from '../entity/UserAssignmentKey';
import DuplicateKeyException from '../../../../../common/common-domain/exception/DuplicateKeyException';
import InternalServerException from '../../../../../common/common-domain/exception/InternalServerException';
import UserAssignmentNotFoundException from '../../../domain/domain-core/exception/UserAssignmentNotFoundException';
import ClassUserAssignmentUpdationException from '../../../domain/domain-core/exception/ClassUserAssignmentUpdationException';
import ClassUserAssignmentDeletionException from '../../../domain/domain-core/exception/ClassUserAssignmentDeletionException';

@Injectable()
export default class UserAssignmentDynamoDBRepository {
  constructor(
    @Inject(DependencyInjection.DYNAMODB_DOCUMENT_CLIENT)
    private readonly dynamoDBDocumentClient: DynamoDBDocumentClient,
    private readonly dynamoDBConfig: DynamoDBConfig,
  ) {}

  public async saveIfNotExistsOrThrow(param: {
    userAssignmentEntity: UserAssignmentEntity;
  }): Promise<void> {
    const { userAssignmentEntity } = param;
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
      if (exception instanceof ConditionalCheckFailedException)
        throw new DuplicateKeyException({ throwable: exception });
      throw new InternalServerException({ throwable: exception });
    }
  }

  public async findMany(param: {
    userId: number;
    pagination: Pagination;
    rangeQuery?: {
      id?: {
        upper?: number;
        lower?: number;
      };
    };
  }): Promise<UserAssignmentEntity[]> {
    const { userId, pagination } = param;
    const userAssignmentEntities: UserAssignmentEntity[] = [];
    let rangeQuery: string = '';
    let expressionAttributeValuesExtension = {};
    const upper: number | undefined = param.rangeQuery?.id?.upper;
    const lower: number | undefined = param.rangeQuery?.id?.lower;
    const lastEvaluatedId: number | undefined =
      param.pagination.lastEvaluatedId;
    if (upper && lower) {
      rangeQuery = 'AND assignmentId BETWEEN :lower AND :upper';
      expressionAttributeValuesExtension = {
        ...expressionAttributeValuesExtension,
        ':upper': upper,
        ':lower': lower,
      };
    }
    if (upper && !lower) {
      rangeQuery = 'AND assignmentId < :upper';
      expressionAttributeValuesExtension = {
        ...expressionAttributeValuesExtension,
        ':upper': upper,
      };
    }
    if (!upper && lower) {
      rangeQuery = 'AND assignmentId > :lower';
      expressionAttributeValuesExtension = {
        ...expressionAttributeValuesExtension,
        ':lower': lower,
      };
    }
    if (!upper && !lower && lastEvaluatedId) {
      rangeQuery = 'AND assignmentId < :value1';
      expressionAttributeValuesExtension = {
        ...expressionAttributeValuesExtension,
        ':value1': lastEvaluatedId,
      };
    }
    let lastEvaluatedKey: Record<string, any> | undefined = undefined;
    let limit: number | undefined = pagination.limit;
    do {
      if (limit === 0) break;
      const { Items, LastEvaluatedKey } =
        await this.dynamoDBDocumentClient.send(
          new QueryCommand({
            TableName: this.dynamoDBConfig.USER_ASSIGNMENT_TABLE,
            KeyConditionExpression: `#userId = :value0 ${rangeQuery}`,
            ExpressionAttributeNames: {
              '#userId': 'userId',
            },
            ExpressionAttributeValues: {
              ':value0': userId,
              ...expressionAttributeValuesExtension,
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
  }): Promise<UserAssignmentEntity> {
    const { userId, assignmentId } = param;
    const response = await this.dynamoDBDocumentClient.send(
      new GetCommand({
        TableName: this.dynamoDBConfig.USER_ASSIGNMENT_TABLE,
        Key: new UserAssignmentKey({ userId, assignmentId }),
      }),
    );
    if (!response.Item) {
      throw new UserAssignmentNotFoundException();
    }
    return strictPlainToClass(UserAssignmentEntity, response.Item);
  }

  public async saveIfExistsAndAssignmentIsPersonalOrThrow(param: {
    userAssignmentEntity: UserAssignmentEntity;
  }): Promise<void> {
    const { userAssignmentEntity } = param;
    const { userId, assignmentId, ...restObj } = userAssignmentEntity;
    const updateObj = DynamoDBBuilder.buildUpdate(restObj);
    if (!updateObj) return;
    try {
      await this.dynamoDBDocumentClient.send(
        new UpdateCommand({
          TableName: this.dynamoDBConfig.USER_ASSIGNMENT_TABLE,
          Key: new UserAssignmentKey({ userId, assignmentId }),
          ConditionExpression:
            'attribute_exists(userId) AND attribute_exists(assignmentId)',
          UpdateExpression: updateObj.UpdateExpression,
          ExpressionAttributeNames: {
            ...updateObj.ExpressionAttributeNames,
          },
          ExpressionAttributeValues: {
            ...updateObj.ExpressionAttributeValues,
          },
        }),
      );
    } catch (exception) {
      if (exception instanceof ConditionalCheckFailedException) {
        const existingAssignment = await this.findByIdOrThrow({
          userId: userAssignmentEntity.userId,
          assignmentId: userAssignmentEntity.assignmentId,
        });
        if (
          existingAssignment.assignmentType !==
          AssignmentType.PERSONAL_ASSIGNMENT
        )
          throw new ClassUserAssignmentUpdationException({
            throwable: exception,
          });
      }
      throw new InternalServerException({ throwable: exception });
    }
  }

  public async deleteIfExistsAndAssignmentIsPersonalOrThrow(param: {
    userId: number;
    assignmentId: number;
  }): Promise<void> {
    const { userId, assignmentId } = param;
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
        try {
          const existingAssignment = await this.findByIdOrThrow({
            userId,
            assignmentId,
          });
          if (
            existingAssignment.assignmentType !==
            AssignmentType.PERSONAL_ASSIGNMENT
          )
            throw new ClassUserAssignmentDeletionException();
        } catch (error) {
          if (error instanceof UserAssignmentNotFoundException) return;
        }
      }
      throw new InternalServerException({ throwable: exception });
    }
  }
}
