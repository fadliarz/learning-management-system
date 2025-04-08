import Pagination from '../../../../../../../common/common-domain/repository/Pagination';
import Scholarship from '../../../../domain-core/entity/Scholarship';

export default interface ScholarshipContext {
  load: () => Promise<Scholarship[]>;
  forceLoad: () => Promise<Scholarship[]>;
  findMany: (param: {
    pagination?: Pagination;
    categories?: number[];
  }) => Promise<Scholarship[]>;
  refresh: (param: { scholarshipId: number }) => Promise<void>;
}
