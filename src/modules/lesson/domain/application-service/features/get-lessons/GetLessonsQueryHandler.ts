import { Inject, Injectable } from '@nestjs/common';
import { LessonRepository } from '../../ports/output/LessonRepository';
import GetLessonsQuery from './dto/GetLessonsQuery';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';
import Lesson from '../../../domain-core/entity/Lesson';
import LessonResponse from '../common/LessonResponse';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class GetLessonsQueryHandler {
  constructor(
    @Inject(DependencyInjection.LESSON_REPOSITORY)
    private readonly lessonRepository: LessonRepository,
  ) {}

  public async execute(
    getLessonsQuery: GetLessonsQuery,
  ): Promise<LessonResponse[]> {
    const lessons: Lesson[] = await this.lessonRepository.findMany({
      ...getLessonsQuery,
      pagination: strictPlainToClass(Pagination, getLessonsQuery),
    });
    return lessons.map((lesson) => strictPlainToClass(LessonResponse, lesson));
  }
}
