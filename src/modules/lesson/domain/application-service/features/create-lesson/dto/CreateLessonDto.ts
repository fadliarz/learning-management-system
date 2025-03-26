import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateLessonDto {
  @ApiProperty()
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(128, { message: 'Title must be at most 128 characters' })
  public title: string;

  @ApiProperty()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(512, { message: 'Description must be at most 512 characters' })
  public description: string;
}
