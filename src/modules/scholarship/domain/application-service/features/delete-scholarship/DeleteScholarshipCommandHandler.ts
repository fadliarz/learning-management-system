import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import { ScholarshipRepository } from '../../ports/output/repository/ScholarshipRepository';
import DeleteScholarshipCommand from './dto/DeleteScholarshipCommand';
import ScholarshipNotFoundException from '../../../domain-core/exception/ScholarshipNotFoundException';
import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class DeleteScholarshipCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: ScholarshipRepository,
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
  }
}
