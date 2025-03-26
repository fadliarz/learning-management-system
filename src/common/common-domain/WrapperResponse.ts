import { ApiProperty } from '@nestjs/swagger';

export default class WrapperResponse<T> {
  @ApiProperty({})
  public data: T;

  constructor(data: T) {
    this.data = data;
  }
}
