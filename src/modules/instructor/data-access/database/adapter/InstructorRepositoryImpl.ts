import { Injectable } from '@nestjs/common';
import InstructorRepository from '../../../domain/application-service/ports/output/InstructorRepository';
import Instructor from '../../../domain/domain-core/entity/Instructor';
import Pagination from '../../../../../common/common-domain/repository/Pagination';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import InstructorDynamoDBRepository from '../repository/InstructorDynamoDBRepository';
import InstructorEntity from '../entity/InstructorEntity';

@Injectable()
export default class InstructorRepositoryImpl implements InstructorRepository {
  constructor(
    private readonly instructorDynamoDBRepository: InstructorDynamoDBRepository,
  ) {}

  public async saveIfNotExistsOrThrow(param: {
    instructor: Instructor;
  }): Promise<void> {
    await this.instructorDynamoDBRepository.saveIfNotExistsOrThrow({
      ...param,
      instructorEntity: strictPlainToClass(InstructorEntity, param.instructor),
    });
  }

  public async findManyByUserId(param: {
    userId: number;
    pagination: Pagination;
  }): Promise<Instructor[]> {
    const instructorEntities: InstructorEntity[] =
      await this.instructorDynamoDBRepository.findManyByUserId(param);
    return instructorEntities.map((instructorEntity) =>
      strictPlainToClass(Instructor, instructorEntity),
    );
  }

  public async findManyByClassId(param: {
    classId: number;
    pagination: Pagination;
  }): Promise<Instructor[]> {
    const instructorEntities: InstructorEntity[] =
      await this.instructorDynamoDBRepository.findManyByClassId(param);
    return instructorEntities.map((instructorEntity) =>
      strictPlainToClass(Instructor, instructorEntity),
    );
  }

  public async deleteIfExistsOrThrow(param: {
    userId: number;
    courseId: number;
    classId: number;
  }): Promise<void> {
    await this.instructorDynamoDBRepository.deleteIfExistsOrThrow(param);
  }
}
