import { Injectable } from '@nestjs/common';
import { ClassAssignmentRepository } from '../../../domain/application-service/ports/output/repository/ClassAssignmentRepository';
import DomainException from '../../../../../common/common-domain/exception/DomainException';
import ClassAssignment from '../../../domain/domain-core/entity/ClassAssignment';
import ClassAssignmentDynamoDBRepository from '../repository/ClassAssignmentDynamoDBRepository';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import ClassAssignmentEntity from '../entity/ClassAssignmentEntity';
import Pagination from '../../../../../common/common-domain/repository/Pagination';

@Injectable()
export default class ClassAssignmentRepositoryImpl
  implements ClassAssignmentRepository
{
  constructor(
    private readonly classAssignmentDynamoDBRepository: ClassAssignmentDynamoDBRepository,
  ) {}

  public async saveIfNotExistsOrThrow(param: {
    classAssignment: ClassAssignment;
    domainException: DomainException;
  }): Promise<void> {
    await this.classAssignmentDynamoDBRepository.saveIfNotExistsOrThrow({
      ...param,
      classAssignmentEntity: strictPlainToClass(
        ClassAssignmentEntity,
        param.classAssignment,
      ),
    });
  }

  public async findMany(param: {
    classId: number;
    pagination: Pagination;
  }): Promise<ClassAssignment[]> {
    const classAssignmentEntities: ClassAssignmentEntity[] =
      await this.classAssignmentDynamoDBRepository.findMany(param);
    return classAssignmentEntities.map((classAssignmentEntity) =>
      strictPlainToClass(ClassAssignment, classAssignmentEntity),
    );
  }

  public async findByIdOrThrow(param: {
    classId: number;
    assignmentId: number;
    domainException: DomainException;
  }): Promise<ClassAssignment> {
    return strictPlainToClass(
      ClassAssignment,
      await this.classAssignmentDynamoDBRepository.findByIdOrThrow(param),
    );
  }

  public async saveIfExistsOrThrow(param: {
    classAssignment: ClassAssignment;
    domainException: DomainException;
  }): Promise<void> {
    await this.classAssignmentDynamoDBRepository.saveIfExistsOrThrow({
      ...param,
      classAssignmentEntity: strictPlainToClass(
        ClassAssignmentEntity,
        param.classAssignment,
      ),
    });
  }

  public async deleteIfExistsOrThrow(param: {
    courseId: number;
    classId: number;
    assignmentId: number;
    domainException: DomainException;
  }): Promise<void> {
    await this.classAssignmentDynamoDBRepository.deleteIfExistsOrThrow(param);
  }
}
