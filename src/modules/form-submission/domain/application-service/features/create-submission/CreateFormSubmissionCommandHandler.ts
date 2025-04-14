import { Inject, Injectable } from '@nestjs/common';
import FormSubmissionRepository from '../../ports/output/repository/FormSubmissionRepository';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import CreateFormSubmissionCommand from './dto/CreateFormSubmissionCommand';
import FormSubmissionResponse from '../common/FormSubmissionResponse';
import FormSubmission from '../../../domain-core/entity/FormSubmission';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';

@Injectable()
export default class CreateFormSubmissionCommandHandler {
  constructor(
    @Inject(DependencyInjection.FORM_SUBMISSION_REPOSITORY)
    private readonly formSubmissionRepository: FormSubmissionRepository,
  ) {}

  public async execute(
    createFormSubmissionCommand: CreateFormSubmissionCommand,
  ): Promise<FormSubmissionResponse> {
    const formSubmission: FormSubmission = strictPlainToClass(
      FormSubmission,
      createFormSubmissionCommand,
    );
    formSubmission.userId = createFormSubmissionCommand.executor.userId;
    formSubmission.create();
    await this.formSubmissionRepository.save({ formSubmission });
    return strictPlainToClass(FormSubmissionResponse, formSubmission);
  }
}
