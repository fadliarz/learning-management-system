import GetUserPrivilegesQuery from './dto/GetUserPrivilegesQuery';
import PrivilegeResponse from '../../../../../privilege/domain/application-service/features/common/PrivilegeResponse';
import { Inject } from '@nestjs/common';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import PrivilegeRepository from '../../../../../privilege/domain/application-service/ports/output/PrivilegeRepository';
import Privilege from '../../../../../privilege/domain/domain-core/entity/Privilege';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';

export default class GetUserPrivilegesQueryHandler {
  constructor(
    @Inject(DependencyInjection.PRIVILEGE_REPOSITORY)
    private readonly privilegeRepository: PrivilegeRepository,
  ) {}

  public async execute(
    getUserPrivilegesQuery: GetUserPrivilegesQuery,
  ): Promise<PrivilegeResponse[]> {
    const privileges: Privilege[] = await this.privilegeRepository.findMany({
      userId: getUserPrivilegesQuery.executor.userId,
    });
    return privileges.map((privilege) =>
      strictPlainToClass(PrivilegeResponse, privilege),
    );
  }
}
