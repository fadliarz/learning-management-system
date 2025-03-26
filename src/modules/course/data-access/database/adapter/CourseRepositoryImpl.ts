import { Injectable } from '@nestjs/common';
import { CourseRepository } from '../../../domain/application-service/ports/output/repository/CourseRepository';
import DomainException from '../../../../../common/common-domain/exception/DomainException';
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
    domainException: DomainException;
  }): Promise<void> {
    await this.courseDynamoDBRepository.saveIfNotExistsOrThrow({
      ...param,
      courseEntity: strictPlainToClass(CourseEntity, param.course),
    });
  }

  public async findMany(param: {
    categories: string[];
    pagination: Pagination;
  }): Promise<Course[]> {
    return Promise.resolve([]);
  }

  public async findByIdOrThrow(param: {
    courseId: number;
    domainException: DomainException;
  }): Promise<Course> {
    return strictPlainToClass(
      Course,
      await this.courseDynamoDBRepository.findByIdOrThrow(param),
    );
  }

  public async saveIfExistsOrThrow(param: {
    course: Course;
    domainException: DomainException;
  }): Promise<void> {
    await this.courseDynamoDBRepository.saveIfExistsOrThrow({
      ...param,
      courseEntity: strictPlainToClass(CourseEntity, param.course),
    });
  }

  public async deleteIfExistsOrThrow(param: {
    courseId: number;
    domainException: DomainException;
  }): Promise<void> {
    await this.courseDynamoDBRepository.deleteIfExistsOrThrow(param);
  }
}
