import { Inject, Injectable } from '@nestjs/common';
import { ScholarshipRepository } from '../../ports/output/repository/ScholarshipRepository';
import GetScholarshipQuery from './dto/GetScholarshipQuery';
import Scholarship from '../../../domain-core/entity/Scholarship';
import ScholarshipResponse from '../common/ScholarshipResponse';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import Tag from '../../../../../tag/domain/domain-core/entity/Tag';
import TagResponse from '../../../../../tag/domain/application-service/features/common/TagResponse';
import TagContext from '../../../../../tag/domain/application-service/ports/output/context/TagContext';
import ScholarshipCacheMemoryImpl from '../../../../data-access/cache/adapter/ScholarshipCacheMemoryImpl';

@Injectable()
export default class GetScholarshipQueryHandler {
  constructor(
    @Inject(DependencyInjection.SCHOLARSHIP_CACHE_MEMORY)
    private readonly scholarshipCacheMemory: ScholarshipCacheMemoryImpl,
    @Inject(DependencyInjection.SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: ScholarshipRepository,
    @Inject(DependencyInjection.TAG_CONTEXT)
    private readonly tagContext: TagContext,
  ) {}

  public async execute(
    getScholarshipQuery: GetScholarshipQuery,
  ): Promise<ScholarshipResponse> {
    const cachedScholarship: Scholarship | null =
      await this.scholarshipCacheMemory.get({
        scholarshipId: getScholarshipQuery.scholarshipId,
      });
    if (cachedScholarship) return this.transform(cachedScholarship);
    const scholarship: Scholarship =
      await this.scholarshipRepository.findByIdOrThrow({
        ...getScholarshipQuery,
      });
    await this.scholarshipCacheMemory.setAndSaveIndex({
      key: { scholarshipId: getScholarshipQuery.scholarshipId },
      value: scholarship,
    });
    return await this.transform(scholarship);
  }

  private async transform(
    scholarship: Scholarship,
  ): Promise<ScholarshipResponse> {
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
    return scholarshipResponse;
  }
}
