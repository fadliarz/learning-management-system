import { Inject, Injectable } from '@nestjs/common';
import CreatePrivilegeCommand from './dto/CreatePrivilegeCommand';
import PrivilegeRepository from '../../ports/output/PrivilegeRepository';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import Privilege from '../../../domain-core/entity/Privilege';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';

@Injectable()
export default class CreatePrivilegeCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.PRIVILEGE_REPOSITORY)
    private readonly privilegeRepository: PrivilegeRepository,
  ) {}

  public async execute(
    createPrivilegeCommand: CreatePrivilegeCommand,
  ): Promise<void> {
    this.authorizationService.authorizeManagePrivilege(
      createPrivilegeCommand.executor,
    );
    const privilege: Privilege = strictPlainToClass(
      Privilege,
      createPrivilegeCommand,
    );
    privilege.create();
    await this.privilegeRepository.saveIfNotExistsOrIgnore({ privilege });
  }
}
