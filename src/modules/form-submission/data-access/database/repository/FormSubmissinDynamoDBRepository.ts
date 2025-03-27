import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../common/common-domain/DependencyInjection';
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import DynamoDBConfig from '../../../../../config/DynamoDBConfig';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import FormSubmissionEntity from '../entity/FormSubmissionEntity';
import Pagination from '../../../../../common/common-domain/repository/Pagination';

@Injectable()
export default class FormSubmissionDynamoDBRepository {
  constructor(
    @Inject(DependencyInjection.DYNAMODB_DOCUMENT_CLIENT)
    private readonly dynamoDBDocumentClient: DynamoDBDocumentClient,
    private readonly dynamoDBConfig: DynamoDBConfig,
  ) {}

  public async save(param: {
    formSubmissionEntity: FormSubmissionEntity;
  }): Promise<void> {
    const { formSubmissionEntity } = param;
    await this.dynamoDBDocumentClient.send(
      new PutCommand({
        TableName: this.dynamoDBConfig.FORM_SUBMISSION_TABLE,
        Item: formSubmissionEntity,
      }),
    );
  }

  public async findMany(param: {
    formId: string;
    pagination: Pagination;
  }): Promise<FormSubmissionEntity[]> {
    const { formId, pagination } = param;
    const formSubmissionEntities: FormSubmissionEntity[] = [];
    let lastEvaluatedKey: Record<string, any> | undefined = undefined;
    let limit: number | undefined = pagination.limit;
    do {
      if (limit === 0) break;
      const { Items, LastEvaluatedKey } =
        await this.dynamoDBDocumentClient.send(
          new QueryCommand({
            TableName: this.dynamoDBConfig.FORM_SUBMISSION_TABLE,
            KeyConditionExpression: pagination.lastEvaluatedId
              ? '#formId = :value0 AND submissionId < :value1'
              : '#formId = :value0',
            ExpressionAttributeNames: {
              '#formId': 'formId',
            },
            ExpressionAttributeValues: {
              ':value0': formId,
              ...(pagination.lastEvaluatedId
                ? { ':value1': pagination.lastEvaluatedId }
                : {}),
            },
            ExclusiveStartKey: lastEvaluatedKey,
            Limit: limit,
          }),
        );
      if (Items) {
        formSubmissionEntities.push(
          ...Items.map((item) =>
            strictPlainToClass(FormSubmissionEntity, item),
          ),
        );
      }
      lastEvaluatedKey = LastEvaluatedKey as Record<string, any> | undefined;
      if (limit) {
        limit = pagination.limit - formSubmissionEntities.length;
      }
    } while (lastEvaluatedKey);
    return formSubmissionEntities;
  }
}
