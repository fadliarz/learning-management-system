import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export default class PushObjectResponse {
  @ApiProperty()
  @Expose()
  public deviceId: string;

  @ApiProperty()
  @Expose()
  public userId: number;

  @ApiProperty()
  @Expose()
  public pushObjectString: string;
}
