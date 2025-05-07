import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import AddScholarshipTagCommand from './dto/AddScholarshipTagCommand';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import { ScholarshipRepository } from '../../ports/output/repository/ScholarshipRepository';
import { TagRepository } from '../../../../../tag/domain/application-service/ports/output/repository/TagRepository';
import ScholarshipContext from '../../ports/output/context/ScholarshipContext';

@Injectable()
export default class AddScholarshipTagCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: ScholarshipRepository,
    @Inject(DependencyInjection.TAG_REPOSITORY)
    private readonly tagRepository: TagRepository,
    @Inject(DependencyInjection.SCHOLARSHIP_CONTEXT)
    private readonly scholarshipContext: ScholarshipContext,
  ) {}

  public async execute(
    addScholarshipTagCommand: AddScholarshipTagCommand,
  ): Promise<void> {
    await this.authorizationService.authorizeManageScholarship(
      addScholarshipTagCommand.executor,
    );
    await this.tagRepository.findByIdOrThrow({
      tagId: addScholarshipTagCommand.tagId,
    });
    await this.scholarshipRepository.addTagIfNotExistsOrIgnore(
      addScholarshipTagCommand,
    );
    await this.scholarshipContext.refresh({
      scholarshipId: addScholarshipTagCommand.scholarshipId,
    });
  }
}
