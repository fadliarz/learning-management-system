import { Inject, Injectable } from '@nestjs/common';
import Pagination from '../../../../../common/common-domain/repository/Pagination';
import { DependencyInjection } from '../../../../../common/common-domain/DependencyInjection';

import { TagRepository } from '../../../domain/application-service/ports/output/repository/TagRepository';
import Tag from '../../../domain/domain-core/entity/Tag';
import TagContext from '../../../domain/application-service/ports/output/context/TagContext';
import TagNotFoundException from '../../../domain/domain-core/exception/TagNotFoundException';

@Injectable()
export default class TagContextImpl implements TagContext {
  private tags: Tag[];

  constructor(
    @Inject(DependencyInjection.TAG_REPOSITORY)
    private readonly tagRepository: TagRepository,
  ) {}

  public async load(): Promise<Tag[]> {
    if (!this.tags) {
      this.tags = await this.tagRepository.findMany({
        pagination: new Pagination(),
      });
    }
    return this.tags;
  }

  public async forceLoad(): Promise<Tag[]> {
    this.tags = await this.tagRepository.findMany({
      pagination: new Pagination(),
    });
    return this.tags;
  }

  public async findById(param: { tagId: number }): Promise<Tag | undefined> {
    await this.load();
    return this.tags.find((tag) => tag.tagId === param.tagId);
  }

  public async findMany(param: { pagination?: Pagination }): Promise<Tag[]> {
    await this.load();
    let filteredTags: Tag[] = this.tags;
    const { pagination } = param;
    if (pagination && pagination.lastEvaluatedId) {
      filteredTags = filteredTags.filter(
        (tags) => tags.tagId < pagination.lastEvaluatedId,
      );
    }
    if (pagination && pagination.limit) {
      filteredTags = filteredTags.slice(0, pagination.limit);
    }
    return filteredTags;
  }

  public async refresh(param: { tagId: number }): Promise<void> {
    const { tagId } = param;
    try {
      const refreshedTag: Tag = await this.tagRepository.findByIdOrThrow({
        tagId,
        domainException: new TagNotFoundException(),
      });
      this.tags = this.tags.map((tag) =>
        tag.tagId === tagId ? refreshedTag : tag,
      );
    } catch (exception) {
      return;
    }
  }
}
