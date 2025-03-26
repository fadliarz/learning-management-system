import { Injectable } from '@nestjs/common';
import Pagination from '../../../../../common/common-domain/repository/Pagination';
import FormSubmissionRepository from '../../../domain/application-service/ports/output/repository/FormSubmissionRepository';
import FormSubmission from '../../../domain/domain-core/entity/FormSubmission';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import FormSubmissionEntity from '../entity/FormSubmissionEntity';
import FormSubmissionDynamoDBRepository from '../repository/FormSubmissinDynamoDBRepository';

@Injectable()
export default class FormSubmissionRepositoryImpl
  implements FormSubmissionRepository
{
  constructor(
    private readonly formSubmissionDynamoDBRepository: FormSubmissionDynamoDBRepository,
  ) {}

  public async save(param: { formSubmission: FormSubmission }): Promise<void> {
    await this.formSubmissionDynamoDBRepository.save({
      formSubmissionEntity: strictPlainToClass(
        FormSubmissionEntity,
        param.formSubmission,
      ),
    });
  }

  public async findMany(param: {
    formId: string;
    pagination: Pagination;
  }): Promise<FormSubmission[]> {
    const formSubmissionEntities =
      await this.formSubmissionDynamoDBRepository.findMany(param);
    return formSubmissionEntities.map((entity) =>
      strictPlainToClass(FormSubmission, entity),
    );
  }
}
