import { Injectable } from '@nestjs/common';
import DomainException from '../../../../../common/common-domain/exception/DomainException';
import { ClassRepository } from '../../../domain/application-service/ports/output/repository/ClassRepository';
import Class from '../../../domain/domain-core/entity/Class';
import ClassDynamoDBRepository from '../repository/ClassDynamoDBRepository';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import ClassEntity from '../entity/ClassEntity';
import Pagination from '../../../../../common/common-domain/repository/Pagination';

@Injectable()
export default class ClassRepositoryImpl implements ClassRepository {
  constructor(
    private readonly classDynamoDBRepository: ClassDynamoDBRepository,
  ) {}

  public async saveIfNotExistsOrThrow(param: {
    courseClass: Class;
    domainException: DomainException;
  }): Promise<void> {
    await this.classDynamoDBRepository.saveIfNotExistsOrThrow({
      ...param,
      classEntity: strictPlainToClass(ClassEntity, param.courseClass),
    });
  }

  public async findMany(param: {
    courseId: number;
    pagination: Pagination;
  }): Promise<Class[]> {
    const classEntities: ClassEntity[] =
      await this.classDynamoDBRepository.findMany(param);
    return classEntities.map((classEntity) =>
      strictPlainToClass(Class, classEntity),
    );
  }

  public async findByIdOrThrow(param: {
    courseId: number;
    classId: number;
    domainException: DomainException;
  }): Promise<Class> {
    return strictPlainToClass(
      Class,
      await this.classDynamoDBRepository.findByIdOrThrow(param),
    );
  }

  public async saveIfExistsOrThrow(param: {
    courseClass: Class;
    domainException: DomainException;
  }): Promise<void> {
    await this.classDynamoDBRepository.saveIfExistsOrThrow({
      ...param,
      classEntity: strictPlainToClass(ClassEntity, param.courseClass),
    });
  }

  public async deleteIfExistsOrThrow(param: {
    courseId: number;
    classId: number;
    domainException: DomainException;
  }): Promise<void> {
    await this.classDynamoDBRepository.deleteIfExistsOrThrow(param);
  }
}
