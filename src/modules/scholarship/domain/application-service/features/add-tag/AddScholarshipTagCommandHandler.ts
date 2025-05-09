import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import AddScholarshipTagCommand from './dto/AddScholarshipTagCommand';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import { ScholarshipRepository } from '../../ports/output/repository/ScholarshipRepository';
import { TagRepository } from '../../../../../tag/domain/application-service/ports/output/repository/TagRepository';
import ScholarshipCacheMemoryImpl from '../../../../data-access/cache/adapter/ScholarshipCacheMemoryImpl';
import Scholarship from '../../../domain-core/entity/Scholarship';

@Injectable()
export default class AddScholarshipTagCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: ScholarshipRepository,
    @Inject(DependencyInjection.TAG_REPOSITORY)
    private readonly tagRepository: TagRepository,
    @Inject(DependencyInjection.SCHOLARSHIP_CACHE_MEMORY)
    private readonly scholarshipCacheMemory: ScholarshipCacheMemoryImpl,
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
    const scholarship: Scholarship | null =
      await this.scholarshipRepository.findById({
        scholarshipId: addScholarshipTagCommand.scholarshipId,
      });
    if (scholarship) {
      await this.scholarshipCacheMemory.setAndSaveIndex({
        key: { scholarshipId: addScholarshipTagCommand.scholarshipId },
        value: scholarship,
      });
      return;
    }
    await this.scholarshipCacheMemory.deleteAndRemoveIndex(
      { scholarshipId: addScholarshipTagCommand.scholarshipId },
      {},
    );
    return;
  }
}
