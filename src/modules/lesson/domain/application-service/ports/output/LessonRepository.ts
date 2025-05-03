import Lesson from '../../../domain-core/entity/Lesson';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';

export interface LessonRepository {
  saveIfNotExistsOrThrow(param: { lesson: Lesson }): Promise<void>;

  saveIfExistsOrThrow(param: { lesson: Lesson }): Promise<void>;

  findMany(param: {
    courseId: number;
    pagination: Pagination;
  }): Promise<Lesson[]>;

  findByIdOrThrow(param: {
    courseId: number;
    lessonId: number;
  }): Promise<Lesson>;

  updateLessonPositionOrThrow(param: {
    lesson: Lesson;
    upperLesson: Lesson | null;
    lowerLesson: Lesson | null;
    version: number;
  }): Promise<void>;

  deleteIfExistsOrThrow(param: {
    courseId: number;
    lessonId: number;
  }): Promise<void>;
}
