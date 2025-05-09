import { Injectable } from '@nestjs/common';
import Pagination from '../../../../common/common-domain/repository/Pagination';
import Tag from '../domain-core/entity/Tag';

@Injectable()
export default class TagHelper {
  public static paginate(tags: Tag[], pagination?: Pagination) {
    let filteredTags: Tag[] = tags;
    if (pagination?.lastEvaluatedId) {
      filteredTags = filteredTags.filter(
        (tag) => tag.tagId < pagination.lastEvaluatedId,
      );
    }
    if (pagination?.limit) {
      filteredTags = filteredTags.slice(0, pagination.limit);
    }
    return filteredTags;
  }
}
