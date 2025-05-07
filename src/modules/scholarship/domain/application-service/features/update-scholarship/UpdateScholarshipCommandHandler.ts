import { Inject, Injectable } from '@nestjs/common';
import UpdateScholarshipCommand from './dto/UpdateScholarshipCommand';
import Scholarship from '../../../domain-core/entity/Scholarship';
import { ScholarshipRepository } from '../../ports/output/repository/ScholarshipRepository';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import ScholarshipResponse from '../common/ScholarshipResponse';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class UpdateScholarshipCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: ScholarshipRepository,
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
    return strictPlainToClass(ScholarshipResponse, scholarship);
  }
}
