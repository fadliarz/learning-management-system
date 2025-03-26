import User from '../../../modules/user/domain/domain-core/entity/User';
import RoleStatusService from '../helper/RoleStatusService';
import { Permission } from '../../../modules/privilege/domain/domain-core/entity/Permission';
import { Inject, Injectable } from '@nestjs/common';
import AuthorizationException from '../exception/AuthorizationException';
import { DependencyInjection } from '../DependencyInjection';
import PrivilegeRepository from '../../../modules/privilege/domain/application-service/ports/output/PrivilegeRepository';

@Injectable()
export default class AuthorizationService {
  constructor(
    @Inject(DependencyInjection.PRIVILEGE_REPOSITORY)
    private readonly privilegeRepository: PrivilegeRepository,
  ) {}

  public async authorizeManageFormSubmissions(user: User): Promise<void> {
    const { isAdmin, isStudent } = RoleStatusService.getRoleStatus(user.role);

    let isAuthorized: boolean = false;
    if (isStudent) {
      await this.privilegeRepository.findByIdOrThrow({
        userId: user.userId,
        permission: Permission.COURSE,
        domainException: new AuthorizationException(),
      });

      isAuthorized = true;
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public authorizeManagePrivilege(user: User): void {
    const { isAdmin } = RoleStatusService.getRoleStatus(user.role);

    let isAuthorized: boolean = false;
    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public async authorizeManageCourse(user: User): Promise<void> {
    const { isAdmin, isStudent } = RoleStatusService.getRoleStatus(user.role);

    let isAuthorized: boolean = false;
    if (isStudent) {
      await this.privilegeRepository.findByIdOrThrow({
        userId: user.userId,
        permission: Permission.COURSE,
        domainException: new AuthorizationException(),
      });

      isAuthorized = true;
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public async authorizeManageScholarship(user: User): Promise<void> {
    const { isAdmin, isStudent } = RoleStatusService.getRoleStatus(user.role);

    let isAuthorized = false;
    if (isStudent) {
      await this.privilegeRepository.findByIdOrThrow({
        userId: user.userId,
        permission: Permission.SCHOLARSHIP,
        domainException: new AuthorizationException(),
      });

      isAuthorized = true;
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public async authorizeManageCategory(user: User): Promise<void> {
    const { isAdmin, isStudent } = RoleStatusService.getRoleStatus(user.role);

    let isAuthorized = false;
    if (isStudent) {
      await this.privilegeRepository.findByIdOrThrow({
        userId: user.userId,
        permission: Permission.COURSE,
        domainException: new AuthorizationException(),
      });

      isAuthorized = true;
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public async authorizeManageClassAssignment(
    user: User,
    classId: number,
  ): Promise<void> {
    const { isAdmin, isStudent } = RoleStatusService.getRoleStatus(user.role);

    let isAuthorized = false;
    if (isStudent) {
      await this.privilegeRepository.findByIdOrThrow({
        userId: user.userId,
        permission: Permission.COURSE,
        domainException: new AuthorizationException(),
      });

      isAuthorized = true;
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }
}
