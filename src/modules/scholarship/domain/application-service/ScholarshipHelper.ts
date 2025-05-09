import { Injectable } from '@nestjs/common';
import Pagination from '../../../../common/common-domain/repository/Pagination';
import Scholarship from '../domain-core/entity/Scholarship';

@Injectable()
export default class ScholarshipHelper {
  public static filterByTags(
    scholarships: Scholarship[],
    tags: number[],
  ): Scholarship[] {
    const filteredScholarships: Scholarship[] = [];
    for (const scholarship of scholarships) {
      if (tags.every((tag) => scholarship.tags.includes(tag))) {
        filteredScholarships.push(scholarship);
      }
    }
    return filteredScholarships;
  }

  public static paginate(scholarships: Scholarship[], pagination?: Pagination) {
    let filteredScholarships: Scholarship[] = scholarships;
    if (pagination?.lastEvaluatedId) {
      filteredScholarships = filteredScholarships.filter(
        (scholarship) => scholarship.scholarshipId < pagination.lastEvaluatedId,
      );
    }
    if (pagination?.limit) {
      filteredScholarships = filteredScholarships.slice(0, pagination.limit);
    }
    return filteredScholarships;
  }
}
