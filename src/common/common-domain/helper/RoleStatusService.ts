import { UserRole } from '../../../modules/user/domain/domain-core/entity/UserRole';

export default class RoleStatusService {
  static getRoleStatus(userRole: UserRole) {
    return {
      isAdmin: userRole === UserRole.ADMIN,
      isStudent: userRole === UserRole.STUDENT,
    };
  }
}
