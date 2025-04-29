import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import { ScholarshipRepository } from '../../ports/output/repository/ScholarshipRepository';
import DeleteScholarshipCommand from './dto/DeleteScholarshipCommand';
import ScholarshipNotFoundException from '../../../domain-core/exception/ScholarshipNotFoundException';
import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import ScholarshipContext from '../../ports/output/context/ScholarshipContext';

@Injectable()
export default class DeleteScholarshipCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: ScholarshipRepository,
    @Inject(DependencyInjection.SCHOLARSHIP_CONTEXT)
    private readonly scholarshipContext: ScholarshipContext,
  ) {}

  public async execute(
    deleteScholarshipCommand: DeleteScholarshipCommand,
  ): Promise<void> {
    await this.authorizationService.authorizeManageScholarship(
      deleteScholarshipCommand.executor,
    );
    await this.scholarshipRepository.deleteIfExistsOrThrow({
      ...deleteScholarshipCommand,
      domainException: new ScholarshipNotFoundException(),
    });
    await this.scholarshipContext.forceLoad();
  }
}
