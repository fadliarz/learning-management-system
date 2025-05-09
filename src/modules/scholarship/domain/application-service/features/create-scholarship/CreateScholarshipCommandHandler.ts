import { Inject, Injectable } from '@nestjs/common';
import CreateScholarshipCommand from './dto/CreateScholarshipCommand';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import Scholarship from '../../../domain-core/entity/Scholarship';
import { ScholarshipRepository } from '../../ports/output/repository/ScholarshipRepository';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import ScholarshipResponse from '../common/ScholarshipResponse';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import ScholarshipCacheMemoryImpl from '../../../../data-access/cache/adapter/ScholarshipCacheMemoryImpl';

@Injectable()
export default class CreateScholarshipCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: ScholarshipRepository,
    @Inject(DependencyInjection.SCHOLARSHIP_CACHE_MEMORY)
    private readonly scholarshipCacheMemory: ScholarshipCacheMemoryImpl,
  ) {}

  public async execute(
    createScholarshipCommand: CreateScholarshipCommand,
  ): Promise<ScholarshipResponse> {
    await this.authorizationService.authorizeManageScholarship(
      createScholarshipCommand.executor,
    );
    const scholarship: Scholarship = strictPlainToClass(
      Scholarship,
      createScholarshipCommand,
    );
    scholarship.create();
    await this.scholarshipRepository.saveIfNotExistsOrThrow({
      scholarship,
    });
    await this.scholarshipCacheMemory.setAndSaveIndex({
      key: { scholarshipId: scholarship.scholarshipId },
      value: scholarship,
    });
    return strictPlainToClass(ScholarshipResponse, scholarship);
  }
}
