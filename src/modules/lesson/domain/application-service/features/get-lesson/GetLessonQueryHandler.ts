import { Inject, Injectable } from '@nestjs/common';
import { LessonRepository } from '../../ports/output/LessonRepository';
import GetLessonQuery from './dto/GetLessonQuery';
import LessonNotFoundException from '../../../domain-core/exception/LessonNotFoundException';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import LessonResponse from '../common/LessonResponse';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class GetLessonQueryHandler {
  constructor(
    @Inject(DependencyInjection.LESSON_REPOSITORY)
    private readonly lessonRepository: LessonRepository,
  ) {}

  public async execute(
    getLessonQuery: GetLessonQuery,
  ): Promise<LessonResponse> {
    const lesson = await this.lessonRepository.findByIdOrThrow({
      ...getLessonQuery,
      domainException: new LessonNotFoundException(),
    });
    return strictPlainToClass(LessonResponse, lesson);
  }
}
