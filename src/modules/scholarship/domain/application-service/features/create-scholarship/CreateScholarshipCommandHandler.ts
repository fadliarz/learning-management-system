import { Inject, Injectable } from '@nestjs/common';
import CreateScholarshipCommand from './dto/CreateScholarshipCommand';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import Scholarship from '../../../domain-core/entity/Scholarship';
import { ScholarshipRepository } from '../../ports/output/repository/ScholarshipRepository';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import ScholarshipResponse from '../common/ScholarshipResponse';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import ScholarshipContext from '../../ports/output/context/ScholarshipContext';

@Injectable()
export default class CreateScholarshipCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: ScholarshipRepository,
    @Inject(DependencyInjection.SCHOLARSHIP_CONTEXT)
    private readonly scholarshipContext: ScholarshipContext,
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
    await this.scholarshipContext.forceLoad();
    return strictPlainToClass(ScholarshipResponse, scholarship);
  }
}
