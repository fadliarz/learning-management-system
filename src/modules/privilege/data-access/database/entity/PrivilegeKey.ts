import { Permission } from '../../../domain/domain-core/entity/Permission';

export default class PrivilegeKey {
  public userId: number;
  public permission: Permission;

  constructor(param: { userId: number; permission: Permission }) {
    this.userId = param.userId;
    this.permission = param.permission;
  }
}
