import GetAdminStatusQuery from './dto/GetAdminStatusQuery';
import { Inject } from '@nestjs/common';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import PrivilegeRepository from '../../../../../privilege/domain/application-service/ports/output/PrivilegeRepository';
import { Permission } from '../../../../../privilege/domain/domain-core/entity/Permission';
import { UserRole } from '../../../domain-core/entity/UserRole';
import InstructorRepository from '../../../../../instructor/domain/application-service/ports/output/InstructorRepository';
import Instructor from '../../../../../instructor/domain/domain-core/entity/Instructor';
import PrivilegeNotFoundException from '../../../../../privilege/domain/domain-core/exception/PrivilegeNotFoundException';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';

export default class GetAdminStatusQueryHandler {
  constructor(
    @Inject(DependencyInjection.INSTRUCTOR_REPOSITORY)
    private readonly instructorRepository: InstructorRepository,
    @Inject(DependencyInjection.PRIVILEGE_REPOSITORY)
    private readonly privilegeRepository: PrivilegeRepository,
  ) {}

  public async execute(
    getAdminStatusQuery: GetAdminStatusQuery,
  ): Promise<boolean> {
    if (getAdminStatusQuery.executor.role === UserRole.ADMIN) return true;
    const instructors: Instructor[] =
      await this.instructorRepository.findManyByUserId({
        userId: getAdminStatusQuery.executor.userId,
        pagination: strictPlainToClass(Pagination, { limit: 1 }),
      });
    if (instructors.length > 0) return true;
    try {
      await this.privilegeRepository.findByIdOrThrow({
        userId: getAdminStatusQuery.executor.userId,
        permission: Permission.SCHOLARSHIP,
      });
      return true;
    } catch (exception) {
      if (exception instanceof PrivilegeNotFoundException) return false;
    }
    return false;
  }
}
