import { Permission } from '../../../../domain-core/entity/Permission';
import User from '../../../../../../user/domain/domain-core/entity/User';

export default class CreatePrivilegeCommand {
  public executor: User;
  public userId: number;
  public permission: Permission;
}
