import { Inject, Injectable } from '@nestjs/common';
import GetScholarshipsQuery from './dto/GetScholarshipsQuery';
import ScholarshipResponse from '../common/ScholarshipResponse';
import Scholarship from '../../../domain-core/entity/Scholarship';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import ScholarshipContext from '../../ports/output/context/ScholarshipContext';
import TagResponse from '../../../../../tag/domain/application-service/features/common/TagResponse';
import TagContext from '../../../../../tag/domain/application-service/ports/output/context/TagContext';
import Tag from '../../../../../tag/domain/domain-core/entity/Tag';

@Injectable()
export default class GetScholarshipsQueryHandler {
  constructor(
    @Inject(DependencyInjection.SCHOLARSHIP_CONTEXT)
    private readonly scholarshipContext: ScholarshipContext,
    @Inject(DependencyInjection.TAG_CONTEXT)
    private readonly tagContext: TagContext,
  ) {}

  public async execute(
    getScholarshipsQuery: GetScholarshipsQuery,
  ): Promise<ScholarshipResponse[]> {
    const scholarships: Scholarship[] = await this.scholarshipContext.findMany({
      ...getScholarshipsQuery,
      pagination: strictPlainToClass(Pagination, getScholarshipsQuery),
    });
    return await this.transform(scholarships);
  }

  private async transform(
    scholarships: Scholarship[],
  ): Promise<ScholarshipResponse[]> {
    const scholarshipResponses: ScholarshipResponse[] = [];
    for (const scholarship of scholarships) {
      const scholarshipResponse: ScholarshipResponse = strictPlainToClass(
        ScholarshipResponse,
        scholarship,
      );
      scholarshipResponse.tags = [];
      for (const tagId of scholarship.tags) {
        const tag: Tag | undefined = await this.tagContext.findById({
          tagId,
        });
        if (tag) {
          scholarshipResponse.tags.push(strictPlainToClass(TagResponse, tag));
        }
      }
      scholarshipResponses.push(scholarshipResponse);
    }
    return scholarshipResponses;
  }
}
