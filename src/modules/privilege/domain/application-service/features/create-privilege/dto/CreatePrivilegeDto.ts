import { Permission } from '../../../../domain-core/entity/Permission';
import { IsEnum, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreatePrivilegeDto {
  @ApiProperty()
  @IsInt({ message: 'userId must be a number' })
  public userId: number;

  @ApiProperty({ enum: Permission })
  @IsEnum(Permission, { message: 'permission must be a valid Permission' })
  public permission: Permission;
}
