import Lesson from '../../../domain-core/entity/Lesson';
import DomainException from '../../../../../../common/common-domain/exception/DomainException';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';

export interface LessonRepository {
  saveIfNotExistsOrThrow(param: {
    lesson: Lesson;
    domainException: DomainException;
  }): Promise<void>;

  saveIfExistsOrThrow(param: {
    lesson: Lesson;
    domainException: DomainException;
  }): Promise<void>;

  findMany(param: {
    courseId: number;
    pagination: Pagination;
  }): Promise<Lesson[]>;

  findByIdOrThrow(param: {
    courseId: number;
    lessonId: number;
    domainException: DomainException;
  }): Promise<Lesson>;

  updateLessonPositionOrThrow(param: {
    lesson: Lesson;
    upperLesson: Lesson | null;
    lowerLesson: Lesson | null;
    version: number;
    domainException: DomainException;
  }): Promise<void>;

  deleteIfExistsOrThrow(param: {
    courseId: number;
    lessonId: number;
    domainException: DomainException;
  }): Promise<void>;
}
