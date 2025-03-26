import { Injectable } from '@nestjs/common';
import DomainException from '../../../../../common/common-domain/exception/DomainException';
import { EnrollmentRepository } from '../../../domain/application-service/ports/output/repository/EnrollmentRepository';
import Enrollment from '../../../domain/domain-core/entity/Enrollment';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import EnrollmentEntity from '../entity/EnrollmentEntity';
import EnrollmentDynamoDBRepository from '../repository/EnrollmentDynamoDBRepository';

@Injectable()
export default class EnrollmentRepositoryImpl implements EnrollmentRepository {
  constructor(
    private readonly enrollmentDynamoDBRepository: EnrollmentDynamoDBRepository,
  ) {}

  public async saveIfNotExistsOrThrow(param: {
    enrollment: Enrollment;
    domainException: DomainException;
  }): Promise<void> {
    await this.enrollmentDynamoDBRepository.saveIfNotExistsOrThrow({
      ...param,
      enrollmentEntity: strictPlainToClass(EnrollmentEntity, param.enrollment),
    });
  }

  public async deleteIfExistsOrThrow(param: {
    userId: number;
    courseId: number;
    classId: number;
    domainException: DomainException;
  }): Promise<void> {
    await this.enrollmentDynamoDBRepository.deleteIfExistsOrThrow(param);
  }
}
