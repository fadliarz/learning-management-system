import Course from '../../../../domain-core/entity/Course';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export interface CourseRepository {
  saveIfNotExistsOrThrow(param: { course: Course }): Promise<void>;

  addCategoryIfNotExistsOrIgnore(param: {
    courseId: number;
    categoryId: number;
  }): Promise<void>;

  removeCategoryIfExistsOrIgnore(param: {
    courseId: number;
    categoryId: number;
  }): Promise<void>;

  findMany(param: { pagination: Pagination }): Promise<Course[]>;

  findById(param: { courseId: number }): Promise<Course | null>;

  findByIdOrThrow(param: { courseId: number }): Promise<Course>;

  saveIfExistsOrThrow(param: { course: Course }): Promise<void>;

  deleteIfExistsOrThrow(param: { courseId: number }): Promise<void>;
}
