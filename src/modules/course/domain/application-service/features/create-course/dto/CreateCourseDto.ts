import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateCourseDto {
  @ApiProperty()
  @IsString({ message: 'Image must be a string' })
  @IsNotEmpty({ message: 'Image is required' })
  @MaxLength(1024, { message: 'Image must be at most 1024 characters' })
  public image: string;

  @ApiProperty()
  @IsString({ message: 'Code must be a string' })
  @IsNotEmpty({ message: 'Code is required' })
  @MaxLength(16, { message: 'Code must be at most 16 characters' })
  public code: string;

  @ApiProperty()
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(64, { message: 'Title must be at most 64 characters' })
  public title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(512, { message: 'Description must be at most 512 characters' })
  public description: string;
}
