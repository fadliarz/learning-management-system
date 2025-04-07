import Course from '../../../../domain-core/entity/Course';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export default interface CourseContext {
  load: () => Promise<Course[]>;
  forceLoad: () => Promise<Course[]>;
  findMany: (param: {
    pagination?: Pagination;
    categories?: number[];
  }) => Promise<Course[]>;
  refresh: (param: { courseId: number }) => Promise<void>;
}
