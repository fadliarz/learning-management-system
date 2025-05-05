import { Injectable } from '@nestjs/common';
import Course from '../domain-core/entity/Course';

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
}
