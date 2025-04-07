import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateAttachmentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'The name must be a string' })
  @IsNotEmpty({ message: 'The name is required' })
  @MaxLength(2048, { message: 'The name must be at most 2048 characters' })
  public name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'The description must be a string' })
  @MaxLength(2048, {
    message: 'The description must be at most 2048 characters',
  })
  public description: string;
}
