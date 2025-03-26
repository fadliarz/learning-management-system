import { Expose } from 'class-transformer';
import ToISO from '../../../../../common/common-domain/decorator/ToISO';
import { Permission } from '../../../domain/domain-core/entity/Permission';

export default class PrivilegeEntity {
  @Expose()
  public userId: number;

  @Expose()
  public permission: Permission;

  @Expose()
  @ToISO()
  public createdAt: string;
}
