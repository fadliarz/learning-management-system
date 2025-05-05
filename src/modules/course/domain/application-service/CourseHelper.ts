import { Injectable } from '@nestjs/common';
import Course from '../domain-core/entity/Course';
import Pagination from '../../../../common/common-domain/repository/Pagination';

@Injectable()
export default class CourseHelper {
  public static filterByCategories(
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

  public static paginate(courses: Course[], pagination?: Pagination) {
    let filteredCourses: Course[] = courses;
    if (pagination?.lastEvaluatedId) {
      filteredCourses = filteredCourses.filter(
        (course) => course.courseId < pagination.lastEvaluatedId,
      );
    }
    if (pagination?.limit) {
      filteredCourses = filteredCourses.slice(0, pagination.limit);
    }
    return filteredCourses;
  }
}
