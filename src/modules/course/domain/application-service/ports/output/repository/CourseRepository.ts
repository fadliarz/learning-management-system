import Course from '../../../../domain-core/entity/Course';
import DomainException from '../../../../../../../common/common-domain/exception/DomainException';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export interface CourseRepository {
  saveIfNotExistsOrThrow(param: {
    course: Course;
    domainException: DomainException;
  }): Promise<void>;

  addCategoryIfNotExistsOrIgnore(param: {
    courseId: number;
    categoryId: number;
  }): Promise<void>;

  findMany(param: { pagination: Pagination }): Promise<Course[]>;

  findByIdOrThrow(param: {
    courseId: number;
    domainException: DomainException;
  }): Promise<Course>;

  saveIfExistsOrThrow(param: {
    course: Course;
    domainException: DomainException;
  }): Promise<void>;

  deleteIfExistsOrThrow(param: {
    courseId: number;
    domainException: DomainException;
  }): Promise<void>;
}
