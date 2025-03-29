import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export default class PublicUserResponse {
  @ApiProperty()
  @Expose()
  public userId: number;

  @ApiProperty()
  @Expose()
  public avatar: string;

  @ApiProperty()
  @Expose()
  public email: string;

  @ApiProperty()
  @Expose()
  public name: string;
}
