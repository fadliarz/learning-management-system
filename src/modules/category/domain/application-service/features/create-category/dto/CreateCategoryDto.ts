import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateCategoryDto {
  @ApiProperty()
  @IsString({ message: 'The title must be a string' })
  @IsNotEmpty({ message: 'The title is required' })
  @MaxLength(32, { message: 'The title must be less than 32 characters' })
  public title: string;
}
