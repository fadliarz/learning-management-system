import { Inject, Injectable } from '@nestjs/common';
import GetScholarshipsQuery from './dto/GetScholarshipsQuery';
import ScholarshipResponse from '../common/ScholarshipResponse';
import Scholarship from '../../../domain-core/entity/Scholarship';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import TagResponse from '../../../../../tag/domain/application-service/features/common/TagResponse';
import TagContext from '../../../../../tag/domain/application-service/ports/output/context/TagContext';
import Tag from '../../../../../tag/domain/domain-core/entity/Tag';
import ScholarshipCacheMemoryImpl from '../../../../data-access/cache/adapter/ScholarshipCacheMemoryImpl';
import { ScholarshipRepository } from '../../ports/output/repository/ScholarshipRepository';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';
import ScholarshipHelper from '../../ScholarshipHelper';

@Injectable()
export default class GetScholarshipsQueryHandler {
  constructor(
    @Inject(DependencyInjection.TAG_CONTEXT)
    private readonly tagContext: TagContext,
    @Inject(DependencyInjection.SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: ScholarshipRepository,
    @Inject(DependencyInjection.SCHOLARSHIP_CACHE_MEMORY)
    private readonly scholarshipCacheMemory: ScholarshipCacheMemoryImpl,
  ) {}

  public async execute(
    getScholarshipsQuery: GetScholarshipsQuery,
  ): Promise<ScholarshipResponse[]> {
    const resourceIds: { scholarshipId: number }[] =
      await this.scholarshipCacheMemory.getKeysByIndex({});
    let scholarships: Scholarship[] = [];
    for (const resourceId of resourceIds) {
      let scholarship: Scholarship | null =
        await this.scholarshipCacheMemory.get(resourceId);
      if (scholarship) {
        scholarships.push(scholarship);
        continue;
      }
      scholarship = await this.scholarshipRepository.findById(resourceId);
      if (scholarship) {
        scholarships.push(scholarship);
        continue;
      }
      await this.scholarshipCacheMemory.deleteAndRemoveIndex(resourceId, {});
    }
    if (getScholarshipsQuery.tags) {
      scholarships = ScholarshipHelper.filterByTags(
        scholarships,
        getScholarshipsQuery.tags,
      );
    }
    scholarships = ScholarshipHelper.paginate(
      scholarships,
      strictPlainToClass(Pagination, getScholarshipsQuery),
    );
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
      if (scholarship.tags) {
        for (const tagId of scholarship.tags) {
          const tag: Tag | undefined = await this.tagContext.findById({
            tagId,
          });
          if (tag) {
            scholarshipResponse.tags.push(strictPlainToClass(TagResponse, tag));
          }
        }
      }
      scholarshipResponses.push(scholarshipResponse);
    }
    return scholarshipResponses;
  }
}
