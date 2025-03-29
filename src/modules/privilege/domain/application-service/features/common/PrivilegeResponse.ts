import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../../../domain-core/entity/Permission';

export default class PrivilegeResponse {
  @ApiProperty()
  @Expose()
  public userId: number;

  @ApiProperty({ enum: Permission })
  @Expose()
  public permission: Permission;

  @ApiProperty()
  @Expose()
  public createdAt: Date;
}
