import { Injectable } from '@nestjs/common';
import CourseScheduleRepository from '../../../domain/application-service/ports/output/repository/CourseScheduleRepository';
import DomainException from '../../../../../common/common-domain/exception/DomainException';
import Pagination from '../../../../../common/common-domain/repository/Pagination';
import CourseSchedule from '../../../domain/domain-core/entity/CourseSchedule';
import CourseScheduleDynamoDBRepository from '../repository/CourseScheduleDynamoDBRepository';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import CourseScheduleEntity from '../entity/CourseScheduleEntity';

@Injectable()
export default class CourseScheduleRepositoryImpl
  implements CourseScheduleRepository
{
  constructor(
    private readonly courseScheduleDynamoDBRepository: CourseScheduleDynamoDBRepository,
  ) {}

  public async saveIfNotExistsOrThrow(param: {
    courseSchedule: CourseSchedule;
    domainException: DomainException;
  }): Promise<void> {
    await this.courseScheduleDynamoDBRepository.saveIfNotExistsOrThrow({
      ...param,
      courseScheduleEntity: strictPlainToClass(
        CourseScheduleEntity,
        param.courseSchedule,
      ),
    });
  }

  public async findMany(param: {
    courseId: number;
    pagination: Pagination;
  }): Promise<CourseSchedule[]> {
    const courseScheduleEntities: CourseScheduleEntity[] =
      await this.courseScheduleDynamoDBRepository.findMany(param);
    return courseScheduleEntities.map((courseScheduleEntity) =>
      strictPlainToClass(CourseSchedule, courseScheduleEntity),
    );
  }

  public async findByIdOrThrow(param: {
    courseId: number;
    scheduleId: number;
    domainException: DomainException;
  }): Promise<CourseSchedule> {
    return strictPlainToClass(
      CourseSchedule,
      await this.courseScheduleDynamoDBRepository.findByIdOrThrow(param),
    );
  }

  public async saveIfExistsOrThrow(param: {
    courseSchedule: CourseSchedule;
    domainException: DomainException;
  }): Promise<void> {
    await this.courseScheduleDynamoDBRepository.saveIfExistsOrThrow({
      ...param,
      courseScheduleEntity: strictPlainToClass(
        CourseScheduleEntity,
        param.courseSchedule,
      ),
    });
  }

  public async deleteIfExistsOrThrow(param: {
    courseId: number;
    scheduleId: number;
    domainException: DomainException;
  }): Promise<void> {
    await this.courseScheduleDynamoDBRepository.deleteIfExistsOrThrow(param);
  }
}
