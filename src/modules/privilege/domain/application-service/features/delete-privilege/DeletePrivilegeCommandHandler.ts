import { Inject, Injectable } from '@nestjs/common';
import PrivilegeRepository from '../../ports/output/PrivilegeRepository';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import DeletePrivilegeCommand from './dto/DeletePrivilegeCommand';

@Injectable()
export default class DeletePrivilegeCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.PRIVILEGE_REPOSITORY)
    private readonly privilegeRepository: PrivilegeRepository,
  ) {}

  public async execute(
    deletePrivilegeCommand: DeletePrivilegeCommand,
  ): Promise<void> {
    this.authorizationService.authorizeManagePrivilege(
      deletePrivilegeCommand.executor,
    );
    await this.privilegeRepository.deleteIfExistsOrIgnore(
      deletePrivilegeCommand,
    );
  }
}
