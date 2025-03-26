import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateCategoryDto {
  @ApiProperty()
  @IsString({ message: 'title must be a string' })
  @IsNotEmpty({ message: 'title is required' })
  @MaxLength(64, {
    message: 'title must be shorter than or equal to 64 characters',
  })
  public title: string;
}
