import { Inject, Injectable } from '@nestjs/common';
import GetScholarshipsQuery from './dto/GetScholarshipsQuery';
import ScholarshipResponse from '../common/ScholarshipResponse';
import Scholarship from '../../../domain-core/entity/Scholarship';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import ScholarshipContext from '../../ports/output/context/ScholarshipContext';

@Injectable()
export default class GetScholarshipsQueryHandler {
  constructor(
    @Inject(DependencyInjection.SCHOLARSHIP_CONTEXT)
    private readonly scholarshipContext: ScholarshipContext,
  ) {}

  public async execute(
    getScholarshipsQuery: GetScholarshipsQuery,
  ): Promise<ScholarshipResponse[]> {
    const scholarships: Scholarship[] = await this.scholarshipContext.findMany({
      ...getScholarshipsQuery,
      pagination: strictPlainToClass(Pagination, getScholarshipsQuery),
    });
    return scholarships.map((scholarship) =>
      strictPlainToClass(ScholarshipResponse, scholarship),
    );
  }
}
