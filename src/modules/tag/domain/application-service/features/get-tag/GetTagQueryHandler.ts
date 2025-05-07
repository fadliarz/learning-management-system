import { Inject, Injectable } from '@nestjs/common';
import { TagRepository } from '../../ports/output/repository/TagRepository';
import GetTagQuery from './dto/GetTagQuery';
import TagResponse from '../common/TagResponse';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class GetTagQueryHandler {
  constructor(
    @Inject(DependencyInjection.TAG_REPOSITORY)
    private readonly tagRepository: TagRepository,
  ) {}

  public async execute(getTagQuery: GetTagQuery): Promise<TagResponse> {
    const tag = await this.tagRepository.findByIdOrThrow({
      ...getTagQuery,
    });
    return strictPlainToClass(TagResponse, tag);
  }
}
