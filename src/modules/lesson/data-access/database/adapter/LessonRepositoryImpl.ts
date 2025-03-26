import { Injectable } from '@nestjs/common';
import { LessonRepository } from '../../../domain/application-service/ports/output/LessonRepository';
import DomainException from '../../../../../common/common-domain/exception/DomainException';
import Pagination from '../../../../../common/common-domain/repository/Pagination';
import Lesson from '../../../domain/domain-core/entity/Lesson';
import LessonDynamoDBRepository from '../repository/LessonDynamoDBRepository';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import LessonEntity from '../entity/LessonEntity';

@Injectable()
export default class LessonRepositoryImpl implements LessonRepository {
  constructor(
    private readonly lessonDynamoDBRepository: LessonDynamoDBRepository,
  ) {}

  public async saveIfNotExistsOrThrow(param: {
    lesson: Lesson;
    domainException: DomainException;
  }): Promise<void> {
    await this.lessonDynamoDBRepository.saveIfNotExistsOrThrow({
      ...param,
      lessonEntity: strictPlainToClass(LessonEntity, param.lesson),
    });
  }

  public async findMany(param: {
    courseId: number;
    pagination: Pagination;
  }): Promise<Lesson[]> {
    const lessonEntities: LessonEntity[] =
      await this.lessonDynamoDBRepository.findMany(param);
    return lessonEntities.map((lessonEntity) =>
      strictPlainToClass(Lesson, lessonEntity),
    );
  }

  public async findByIdOrThrow(param: {
    courseId: number;
    lessonId: number;
    domainException: DomainException;
  }): Promise<Lesson> {
    return strictPlainToClass(
      Lesson,
      await this.lessonDynamoDBRepository.findByIdOrThrow(param),
    );
  }

  public async saveIfExistsOrThrow(param: {
    lesson: Lesson;
    domainException: DomainException;
  }): Promise<void> {
    await this.lessonDynamoDBRepository.saveIfExistsOrThrow({
      ...param,
      lessonEntity: strictPlainToClass(LessonEntity, param.lesson),
    });
  }

  public async updateLessonPositionOrThrow(param: {
    lesson: Lesson;
    upperLesson: Lesson | null;
    lowerLesson: Lesson | null;
    version: number;
    domainException: DomainException;
  }): Promise<void> {
    await this.lessonDynamoDBRepository.updateLessonPositionOrThrow({
      lesson: strictPlainToClass(LessonEntity, param.lesson),
      upperLesson: param.upperLesson
        ? strictPlainToClass(LessonEntity, param.upperLesson)
        : null,
      lowerLesson: param.lowerLesson
        ? strictPlainToClass(LessonEntity, param.lowerLesson)
        : null,
      version: param.version,
      domainException: param.domainException,
    });
  }

  public async deleteIfExistsOrThrow(param: {
    courseId: number;
    lessonId: number;
    domainException: DomainException;
  }): Promise<void> {
    await this.lessonDynamoDBRepository.deleteIfExistsOrThrow(param);
  }
}
