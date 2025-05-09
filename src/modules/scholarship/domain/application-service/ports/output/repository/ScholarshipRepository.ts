import Scholarship from '../../../../domain-core/entity/Scholarship';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export interface ScholarshipRepository {
  saveIfNotExistsOrThrow(param: { scholarship: Scholarship }): Promise<void>;

  addTagIfNotExistsOrIgnore(param: {
    scholarshipId: number;
    tagId: number;
  }): Promise<void>;

  removeTagIfExistsOrIgnore(param: {
    scholarshipId: number;
    tagId: number;
  }): Promise<void>;

  findMany(param: { pagination: Pagination }): Promise<Scholarship[]>;

  findById(param: { scholarshipId: number }): Promise<Scholarship | null>;

  findByIdOrThrow(param: { scholarshipId: number }): Promise<Scholarship>;

  saveIfExistsOrThrow(param: { scholarship: Scholarship }): Promise<void>;

  deleteIfExistsOrThrow(param: { scholarshipId: number }): Promise<void>;
}
