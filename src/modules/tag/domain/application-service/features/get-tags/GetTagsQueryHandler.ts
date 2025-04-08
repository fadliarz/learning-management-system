import TagResponse from '../common/TagResponse';
import { Inject, Injectable } from '@nestjs/common';
import { TagRepository } from '../../ports/output/repository/TagRepository';
import GetTagsQuery from './dto/GetTagsQuery';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import Tag from '../../../domain-core/entity/Tag';

@Injectable()
export default class GetTagsQueryHandler {
  constructor(
    @Inject(DependencyInjection.TAG_REPOSITORY)
    private readonly tagRepository: TagRepository,
  ) {}

  public async execute(getTagsQuery: GetTagsQuery): Promise<TagResponse[]> {
    const tags: Tag[] = await this.tagRepository.findMany({
      pagination: strictPlainToClass(Pagination, getTagsQuery),
    });
    return tags.map((tag) => strictPlainToClass(TagResponse, tag));
  }
}
