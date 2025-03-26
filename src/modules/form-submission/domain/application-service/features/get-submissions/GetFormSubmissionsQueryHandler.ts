import { Inject, Injectable } from '@nestjs/common';
import FormSubmissionRepository from '../../ports/output/repository/FormSubmissionRepository';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import FormSubmissionResponse from '../common/FormSubmissionResponse';
import GetFormSubmissionsQuery from './dto/GetFormSubmissionsQuery';
import FormSubmission from '../../../domain-core/entity/FormSubmission';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';

@Injectable()
export default class GetFormSubmissionsQueryHandler {
  constructor(
    @Inject(DependencyInjection.FORM_SUBMISSION_REPOSITORY)
    private readonly formSubmissionRepository: FormSubmissionRepository,
    private readonly authorizationService: AuthorizationService,
  ) {}

  public async execute(
    getFormSubmissionsQuery: GetFormSubmissionsQuery,
  ): Promise<FormSubmissionResponse[]> {
    await this.authorizationService.authorizeManageFormSubmissions(
      getFormSubmissionsQuery.executor,
    );
    const formSubmissions: FormSubmission[] =
      await this.formSubmissionRepository.findMany({
        ...getFormSubmissionsQuery,
        pagination: strictPlainToClass(Pagination, getFormSubmissionsQuery),
      });
    return formSubmissions.map((formSubmission) =>
      strictPlainToClass(FormSubmissionResponse, formSubmission),
    );
  }
}
