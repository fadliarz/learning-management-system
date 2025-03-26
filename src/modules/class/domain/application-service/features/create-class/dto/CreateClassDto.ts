import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateClassDto {
  @ApiProperty()
  @IsString({ message: 'The title must be a string' })
  @IsNotEmpty({ message: 'The title is required' })
  @MaxLength(128, { message: 'The title must be less than 128 characters' })
  public title: string;
}
