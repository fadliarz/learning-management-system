import { Injectable } from '@nestjs/common';
import { EnrollmentRepository } from '../../../domain/application-service/ports/output/repository/EnrollmentRepository';
import Enrollment from '../../../domain/domain-core/entity/Enrollment';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import EnrollmentEntity from '../entity/EnrollmentEntity';
import EnrollmentDynamoDBRepository from '../repository/EnrollmentDynamoDBRepository';
import Pagination from '../../../../../common/common-domain/repository/Pagination';

@Injectable()
export default class EnrollmentRepositoryImpl implements EnrollmentRepository {
  constructor(
    private readonly enrollmentDynamoDBRepository: EnrollmentDynamoDBRepository,
  ) {}

  public async saveIfNotExistsOrThrow(param: {
    enrollment: Enrollment;
  }): Promise<void> {
    await this.enrollmentDynamoDBRepository.saveIfNotExistsOrThrow({
      ...param,
      enrollmentEntity: strictPlainToClass(EnrollmentEntity, param.enrollment),
    });
  }

  public async findManyByUserId(param: {
    userId: number;
    pagination: Pagination;
  }): Promise<Enrollment[]> {
    const enrollmentEntities: EnrollmentEntity[] =
      await this.enrollmentDynamoDBRepository.findMany(param);
    return enrollmentEntities.map((enrollmentEntity) =>
      strictPlainToClass(Enrollment, enrollmentEntity),
    );
  }

  public async deleteIfExistsOrThrow(param: {
    userId: number;
    courseId: number;
    classId: number;
  }): Promise<void> {
    await this.enrollmentDynamoDBRepository.deleteIfExistsOrThrow(param);
  }
}
