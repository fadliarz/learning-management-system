import { Inject, Injectable } from '@nestjs/common';
import { ScholarshipRepository } from '../../ports/output/repository/ScholarshipRepository';
import GetScholarshipQuery from './dto/GetScholarshipQuery';
import Scholarship from '../../../domain-core/entity/Scholarship';
import ScholarshipNotFoundException from '../../../domain-core/exception/ScholarshipNotFoundException';
import ScholarshipResponse from '../common/ScholarshipResponse';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class GetScholarshipQueryHandler {
  constructor(
    @Inject(DependencyInjection.SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: ScholarshipRepository,
  ) {}

  public async execute(
    getScholarshipQuery: GetScholarshipQuery,
  ): Promise<ScholarshipResponse> {
    const scholarship: Scholarship =
      await this.scholarshipRepository.findByIdOrThrow({
        ...getScholarshipQuery,
        domainException: new ScholarshipNotFoundException(),
      });
    return strictPlainToClass(ScholarshipResponse, scholarship);
  }
}
