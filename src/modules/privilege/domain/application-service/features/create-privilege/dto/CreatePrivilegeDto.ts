import { Permission } from '../../../../domain-core/entity/Permission';
import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreatePrivilegeDto {
  @ApiProperty()
  @IsString({ message: 'executor must be a string' })
  public userId: number;

  @ApiProperty({ enum: Permission })
  @IsEnum(Permission, { message: 'permission must be a valid Permission' })
  public permission: Permission;
}
