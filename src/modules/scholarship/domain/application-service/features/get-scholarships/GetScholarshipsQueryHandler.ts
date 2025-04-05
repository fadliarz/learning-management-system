import { Inject, Injectable } from '@nestjs/common';
import GetScholarshipsQuery from './dto/GetScholarshipsQuery';
import { ScholarshipRepository } from '../../ports/output/repository/ScholarshipRepository';
import ScholarshipResponse from '../common/ScholarshipResponse';
import Scholarship from '../../../domain-core/entity/Scholarship';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class GetScholarshipsQueryHandler {
  constructor(
    @Inject(DependencyInjection.SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: ScholarshipRepository,
  ) {}

  public async execute(
    getScholarshipsQuery: GetScholarshipsQuery,
  ): Promise<ScholarshipResponse[]> {
    const scholarships: Scholarship[] =
      await this.scholarshipRepository.findMany({
        pagination: strictPlainToClass(Pagination, getScholarshipsQuery),
      });
    return scholarships.map((scholarship) =>
      strictPlainToClass(ScholarshipResponse, scholarship),
    );
  }
}
