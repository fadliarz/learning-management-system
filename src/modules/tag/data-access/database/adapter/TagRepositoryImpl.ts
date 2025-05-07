import { Injectable } from '@nestjs/common';
import { TagRepository } from '../../../domain/application-service/ports/output/repository/TagRepository';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import TagEntity from '../entity/TagEntity';
import Pagination from '../../../../../common/common-domain/repository/Pagination';
import TagDynamoDBRepository from '../repository/TagDynamoDBRepository';
import Tag from '../../../domain/domain-core/entity/Tag';

@Injectable()
export default class TagRepositoryImpl implements TagRepository {
  constructor(private readonly tagDynamoDBRepository: TagDynamoDBRepository) {}

  public async saveIfNotExistsOrThrow(param: { tag: Tag }): Promise<void> {
    await this.tagDynamoDBRepository.saveIfNotExistsOrThrow({
      ...param,
      tagEntity: strictPlainToClass(TagEntity, param.tag),
    });
  }

  public async findByIdOrThrow(param: { tagId: number }): Promise<Tag> {
    return strictPlainToClass(
      Tag,
      await this.tagDynamoDBRepository.findByIdOrThrow(param),
    );
  }

  public async findMany(param: { pagination: Pagination }): Promise<Tag[]> {
    const tagEntities: TagEntity[] =
      await this.tagDynamoDBRepository.findMany(param);
    return tagEntities.map((tagEntity) => strictPlainToClass(Tag, tagEntity));
  }

  async saveIfExistsOrThrow(param: { tag: Tag }): Promise<void> {
    await this.tagDynamoDBRepository.saveIfExistsOrThrow({
      ...param,
      tagEntity: strictPlainToClass(TagEntity, param.tag),
    });
  }

  async deleteIfExistsOrThrow(param: { tagId: number }): Promise<void> {
    await this.tagDynamoDBRepository.deleteIfExistsOrThrow(param);
  }
}
