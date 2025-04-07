import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateCourseDto {
  @ApiProperty()
  @IsString({ message: 'Image must be a string' })
  @IsNotEmpty({ message: 'Image is required' })
  @MaxLength(2048, { message: 'Image must be at most 2048 characters' })
  public image: string;

  @ApiProperty()
  @IsString({ message: 'Code must be a string' })
  @IsNotEmpty({ message: 'Code is required' })
  @MaxLength(16, { message: 'Code must be at most 16 characters' })
  public code: string;

  @ApiProperty()
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(256, { message: 'Title must be at most 256 characters' })
  public title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(2048, { message: 'Description must be at most 2048 characters' })
  public description: string;
}
