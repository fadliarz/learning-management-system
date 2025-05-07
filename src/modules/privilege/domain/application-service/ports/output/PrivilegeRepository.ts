import Privilege from '../../../domain-core/entity/Privilege';
import { Permission } from '../../../domain-core/entity/Permission';
import DomainException from '../../../../../../common/common-domain/exception/DomainException';

export default interface PrivilegeRepository {
  saveIfNotExistsOrIgnore(param: { privilege: Privilege }): Promise<void>;

  findByIdOrThrow(param: {
    userId: number;
    permission: Permission;
    domainException?: DomainException;
  }): Promise<void>;

  findMany(param: { userId: number }): Promise<Privilege[]>;

  deleteIfExistsOrIgnore(param: {
    userId: number;
    permission: Permission;
  }): Promise<void>;
}
