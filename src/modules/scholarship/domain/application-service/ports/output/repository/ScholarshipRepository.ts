import Scholarship from '../../../../domain-core/entity/Scholarship';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';
import DomainException from '../../../../../../../common/common-domain/exception/DomainException';

export interface ScholarshipRepository {
  saveIfNotExistsOrThrow(param: {
    scholarship: Scholarship;
    domainException: DomainException;
  }): Promise<void>;

  addTagIfNotExistsOrIgnore(param: {
    scholarshipId: number;
    tagId: number;
  }): Promise<void>;

  findMany(param: { pagination: Pagination }): Promise<Scholarship[]>;

  findByIdOrThrow(param: {
    scholarshipId: number;
    domainException: DomainException;
  }): Promise<Scholarship>;

  saveIfExistsOrThrow(param: {
    scholarship: Scholarship;
    domainException: DomainException;
  }): Promise<void>;

  deleteIfExistsOrThrow(param: {
    scholarshipId: number;
    domainException: DomainException;
  }): Promise<void>;
}
