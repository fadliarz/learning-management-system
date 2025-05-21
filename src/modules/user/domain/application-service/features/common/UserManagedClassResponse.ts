import { ApiProperty } from '@nestjs/swagger';

export default class UserManagedClassResponse {
  @ApiProperty()
  public courseId: number;

  @ApiProperty()
  public classId: number;

  @ApiProperty()
  public courseTitle: string;

  @ApiProperty()
  public className: string;
}
