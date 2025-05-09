import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import { ScholarshipRepository } from '../../ports/output/repository/ScholarshipRepository';
import DeleteScholarshipCommand from './dto/DeleteScholarshipCommand';
import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import ScholarshipCacheMemoryImpl from '../../../../data-access/cache/adapter/ScholarshipCacheMemoryImpl';

@Injectable()
export default class DeleteScholarshipCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: ScholarshipRepository,
    @Inject(DependencyInjection.SCHOLARSHIP_CACHE_MEMORY)
    private readonly scholarshipCacheMemory: ScholarshipCacheMemoryImpl,
  ) {}

  public async execute(
    deleteScholarshipCommand: DeleteScholarshipCommand,
  ): Promise<void> {
    await this.authorizationService.authorizeManageScholarship(
      deleteScholarshipCommand.executor,
    );
    await this.scholarshipRepository.deleteIfExistsOrThrow({
      ...deleteScholarshipCommand,
    });
    await this.scholarshipCacheMemory.deleteAndRemoveIndex(
      { scholarshipId: deleteScholarshipCommand.scholarshipId },
      {},
    );
  }
}
