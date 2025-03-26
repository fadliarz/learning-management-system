import { Inject, Injectable } from '@nestjs/common';
import CreateScholarshipCommand from './dto/CreateScholarshipCommand';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import Scholarship from '../../../domain-core/entity/Scholarship';
import { ScholarshipRepository } from '../../ports/output/repository/ScholarshipRepository';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import ScholarshipResponse from '../common/ScholarshipResponse';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import DomainException from '../../../../../../common/common-domain/exception/DomainException';

@Injectable()
export default class CreateScholarshipCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: ScholarshipRepository,
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
      domainException: new DomainException(),
    });
    return strictPlainToClass(ScholarshipResponse, scholarship);
  }
}
