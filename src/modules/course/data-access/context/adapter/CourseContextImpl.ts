import { Inject, Injectable } from '@nestjs/common';
import CourseContext from '../../../domain/application-service/ports/output/context/CourseContext';
import Pagination from '../../../../../common/common-domain/repository/Pagination';
import Course from '../../../domain/domain-core/entity/Course';
import { CourseRepository } from '../../../domain/application-service/ports/output/repository/CourseRepository';
import { DependencyInjection } from '../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class CourseContextImpl implements CourseContext {
  private courses: Course[];

  constructor(
    @Inject(DependencyInjection.COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
  ) {}

  public async load(): Promise<Course[]> {
    if (!this.courses) {
      this.courses = await this.courseRepository.findMany({
        pagination: new Pagination(),
      });
    }
    return this.courses;
  }

  public async forceLoad(): Promise<Course[]> {
    this.courses = await this.courseRepository.findMany({
      pagination: new Pagination(),
    });
    return this.courses;
  }

  public async findMany(param: {
    pagination?: Pagination;
    categories?: number[];
  }): Promise<Course[]> {
    await this.load();
    let filteredCourses: Course[] = this.courses;
    const { pagination, categories } = param;
    if (categories) {
      filteredCourses = this.filterCourseByCategories(
        filteredCourses,
        categories,
      );
    }
    if (pagination && pagination.lastEvaluatedId) {
      filteredCourses = filteredCourses.filter(
        (course) => course.courseId < pagination.lastEvaluatedId,
      );
    }
    if (pagination && pagination.limit) {
      filteredCourses = filteredCourses.slice(0, pagination.limit);
    }
    return filteredCourses;
  }

  private filterCourseByCategories(
    courses: Course[],
    categories: number[],
  ): Course[] {
    const filteredCourses: Course[] = [];
    for (const course of courses) {
      if (
        categories.every((category) => course.categories.includes(category))
      ) {
        filteredCourses.push(course);
      }
    }
    return filteredCourses;
  }
}
