import { Injectable } from '@nestjs/common';
import { CourseRepository } from '../../../domain/application-service/ports/output/repository/CourseRepository';
import Course from '../../../domain/domain-core/entity/Course';
import Pagination from '../../../../../common/common-domain/repository/Pagination';
import CourseDynamoDBRepository from '../repository/CourseDynamoDBRepository';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import CourseEntity from '../entity/CourseEntity';

@Injectable()
export default class CourseRepositoryImpl implements CourseRepository {
  constructor(
    private readonly courseDynamoDBRepository: CourseDynamoDBRepository,
  ) {}

  public async saveIfNotExistsOrThrow(param: {
    course: Course;
  }): Promise<void> {
    await this.courseDynamoDBRepository.saveIfNotExistsOrThrow({
      ...param,
      courseEntity: strictPlainToClass(CourseEntity, param.course),
    });
  }

  public async addCategoryIfNotExistsOrIgnore(param: {
    courseId: number;
    categoryId: number;
  }): Promise<void> {
    await this.courseDynamoDBRepository.addCategoryIfNotExistsOrIgnore(param);
  }

  public async removeCategoryIfExistsOrIgnore(param: {
    courseId: number;
    categoryId: number;
  }): Promise<void> {
    await this.courseDynamoDBRepository.removeCategoryIfExistsOrIgnore(param);
  }

  public async findMany(param: { pagination: Pagination }): Promise<Course[]> {
    const courseEntities: CourseEntity[] =
      await this.courseDynamoDBRepository.findMany(param);
    return courseEntities.map((courseEntity) =>
      strictPlainToClass(Course, courseEntity),
    );
  }

  public async findById(param: { courseId: number }): Promise<Course | null> {
    const courseEntity: CourseEntity | null =
      await this.courseDynamoDBRepository.findById({
        courseId: param.courseId,
      });

    return courseEntity ? strictPlainToClass(Course, courseEntity) : null;
  }

  public async findByIdOrThrow(param: { courseId: number }): Promise<Course> {
    return strictPlainToClass(
      Course,
      await this.courseDynamoDBRepository.findByIdOrThrow(param),
    );
  }

  public async saveIfExistsOrThrow(param: { course: Course }): Promise<void> {
    await this.courseDynamoDBRepository.saveIfExistsOrThrow({
      ...param,
      courseEntity: strictPlainToClass(CourseEntity, param.course),
    });
  }

  public async deleteIfExistsOrThrow(param: {
    courseId: number;
  }): Promise<void> {
    await this.courseDynamoDBRepository.deleteIfExistsOrThrow(param);
  }
}
