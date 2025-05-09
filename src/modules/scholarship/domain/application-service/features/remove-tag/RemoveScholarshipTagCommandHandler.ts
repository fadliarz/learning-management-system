import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import RemoveScholarshipTagCommand from './dto/RemoveScholarshipTagCommand';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import { ScholarshipRepository } from '../../ports/output/repository/ScholarshipRepository';
import ScholarshipCacheMemoryImpl from '../../../../data-access/cache/adapter/ScholarshipCacheMemoryImpl';
import Scholarship from '../../../domain-core/entity/Scholarship';

@Injectable()
export default class RemoveScholarshipTagCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: ScholarshipRepository,
    @Inject(DependencyInjection.SCHOLARSHIP_CACHE_MEMORY)
    private readonly scholarshipCacheMemory: ScholarshipCacheMemoryImpl,
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
    const scholarship: Scholarship | null =
      await this.scholarshipRepository.findById({
        scholarshipId: removeScholarshipTagCommand.scholarshipId,
      });
    if (scholarship) {
      await this.scholarshipCacheMemory.setAndSaveIndex({
        key: { scholarshipId: removeScholarshipTagCommand.scholarshipId },
        value: scholarship,
      });
    }
  }
}
