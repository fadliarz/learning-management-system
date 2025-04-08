import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import RemoveScholarshipTagCommand from './dto/RemoveScholarshipTagCommand';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import { ScholarshipRepository } from '../../ports/output/repository/ScholarshipRepository';
import ScholarshipContext from '../../ports/output/context/ScholarshipContext';

@Injectable()
export default class RemoveScholarshipTagCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: ScholarshipRepository,
    @Inject(DependencyInjection.SCHOLARSHIP_CONTEXT)
    private readonly scholarshipContext: ScholarshipContext,
  ) {}

  public async execute(
    removeScholarshipTagCommand: RemoveScholarshipTagCommand,
  ): Promise<void> {
    await this.authorizationService.authorizeManageScholarship(
      removeScholarshipTagCommand.executor,
    );
    await this.scholarshipRepository.removeTagIfExistsOrIgnore(
      removeScholarshipTagCommand,
    );
    await this.scholarshipContext.refresh({
      scholarshipId: removeScholarshipTagCommand.scholarshipId,
    });
  }
}
