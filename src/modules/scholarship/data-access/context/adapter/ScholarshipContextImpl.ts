import { Inject, Injectable } from '@nestjs/common';
import Pagination from '../../../../../common/common-domain/repository/Pagination';
import { DependencyInjection } from '../../../../../common/common-domain/DependencyInjection';
import Scholarship from '../../../domain/domain-core/entity/Scholarship';
import { ScholarshipRepository } from '../../../domain/application-service/ports/output/repository/ScholarshipRepository';
import ScholarshipContext from '../../../domain/application-service/ports/output/context/ScholarshipContext';
import ScholarshipNotFoundException from '../../../domain/domain-core/exception/ScholarshipNotFoundException';

@Injectable()
export default class ScholarshipContextImpl implements ScholarshipContext {
  private scholarships: Scholarship[];

  constructor(
    @Inject(DependencyInjection.SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: ScholarshipRepository,
  ) {}

  public async load(): Promise<Scholarship[]> {
    if (!this.scholarships) {
      this.scholarships = await this.scholarshipRepository.findMany({
        pagination: new Pagination(),
      });
    }
    return this.scholarships;
  }

  public async forceLoad(): Promise<Scholarship[]> {
    this.scholarships = await this.scholarshipRepository.findMany({
      pagination: new Pagination(),
    });
    return this.scholarships;
  }

  public async findMany(param: {
    pagination?: Pagination;
    categories?: number[];
  }): Promise<Scholarship[]> {
    await this.load();
    let filteredScholarships: Scholarship[] = this.scholarships;
    const { pagination, categories } = param;
    if (categories) {
      filteredScholarships = this.filterScholarshipByTags(
        filteredScholarships,
        categories,
      );
    }
    if (pagination && pagination.lastEvaluatedId) {
      filteredScholarships = filteredScholarships.filter(
        (scholarship) => scholarship.scholarshipId < pagination.lastEvaluatedId,
      );
    }
    if (pagination && pagination.limit) {
      filteredScholarships = filteredScholarships.slice(0, pagination.limit);
    }
    return filteredScholarships;
  }

  public async refresh(param: { scholarshipId: number }): Promise<void> {
    const { scholarshipId } = param;
    try {
      const refreshedScholarship: Scholarship =
        await this.scholarshipRepository.findByIdOrThrow({
          scholarshipId,
          domainException: new ScholarshipNotFoundException(),
        });
      this.scholarships = this.scholarships.map((scholarship) =>
        scholarship.scholarshipId === scholarshipId
          ? refreshedScholarship
          : scholarship,
      );
    } catch (exception) {
      return;
    }
  }

  private filterScholarshipByTags(
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
}
