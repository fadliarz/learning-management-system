import { Inject, Injectable } from '@nestjs/common';
import UpdateScholarshipCommand from './dto/UpdateScholarshipCommand';
import Scholarship from '../../../domain-core/entity/Scholarship';
import { ScholarshipRepository } from '../../ports/output/repository/ScholarshipRepository';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import ScholarshipResponse from '../common/ScholarshipResponse';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import ScholarshipCacheMemoryImpl from '../../../../data-access/cache/adapter/ScholarshipCacheMemoryImpl';

@Injectable()
export default class UpdateScholarshipCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: ScholarshipRepository,
    @Inject(DependencyInjection.SCHOLARSHIP_CACHE_MEMORY)
    private readonly scholarshipCacheMemory: ScholarshipCacheMemoryImpl,
  ) {}

  public async execute(
    updateScholarshipCommand: UpdateScholarshipCommand,
  ): Promise<ScholarshipResponse> {
    await this.authorizationService.authorizeManageScholarship(
      updateScholarshipCommand.executor,
    );
    const scholarship: Scholarship = strictPlainToClass(
      Scholarship,
      updateScholarshipCommand,
    );
    scholarship.update();
    await this.scholarshipRepository.saveIfExistsOrThrow({
      scholarship,
    });
    const updatedScholarship: Scholarship | null =
      await this.scholarshipRepository.findById({
        scholarshipId: scholarship.scholarshipId,
      });
    if (updatedScholarship) {
      await this.scholarshipCacheMemory.setAndSaveIndex({
        key: { scholarshipId: scholarship.scholarshipId },
        value: updatedScholarship,
      });
    }
    if (!updatedScholarship) {
      await this.scholarshipCacheMemory.deleteAndRemoveIndex(
        {
          scholarshipId: scholarship.scholarshipId,
        },
        {},
      );
    }
    return strictPlainToClass(ScholarshipResponse, scholarship);
  }
}
