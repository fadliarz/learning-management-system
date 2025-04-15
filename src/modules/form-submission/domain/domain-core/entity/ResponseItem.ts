import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';

export default class ResponseItem {
  @ApiProperty()
  @IsString({ message: 'type must be a string' })
  @IsNotEmpty({ message: 'type is required' })
  @MaxLength(64, {
    message: 'type must be shorter than or equal to 64 characters',
  })
  @Expose()
  public type: string;

  @ApiProperty()
  @IsString({ message: 'field must be a string' })
  @IsNotEmpty({ message: 'field is required' })
  @MaxLength(256, {
    message: 'field must be shorter than or equal to 256 characters',
  })
  @Expose()
  public field: string;

  @ApiProperty()
  @IsString({ message: 'value must be a string' })
  @IsNotEmpty({ message: 'value is required' })
  @MaxLength(1024, {
    message: 'value must be shorter than or equal to 1024 characters',
  })
  @Expose()
  public value: string;
}
