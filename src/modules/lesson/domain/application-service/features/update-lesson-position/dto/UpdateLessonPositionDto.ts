import { IsInt, IsPositive, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateLessonPositionDto {
  @ApiProperty()
  @IsInt({ message: 'The arrangement version must be an integer' })
  @IsPositive({ message: 'The arrangement version must be a positive integer' })
  public version: number;

  @ApiProperty({ required: false })
  @ValidateIf((o: UpdateLessonPositionDto) => o.lowerLessonId === undefined, {
    message: 'The upper lesson id or the lower lesson id must be provided',
  })
  @IsInt({ message: 'The upper lesson id must be an integer' })
  @IsPositive({ message: 'The upper lesson id must be a positive integer' })
  public upperLessonId: number;

  @ApiProperty({ required: false })
  @ValidateIf((o: UpdateLessonPositionDto) => o.upperLessonId !== undefined)
  @IsInt({ message: 'The upper lesson position must be an integer' })
  @IsPositive({
    message: 'The upper lesson position must be a positive integer',
  })
  public upperLessonPosition: number;

  @ApiProperty({ required: false })
  @ValidateIf((o: UpdateLessonPositionDto) => o.upperLessonId === undefined, {
    message: 'The upper lesson id or the lower lesson id must be provided',
  })
  @IsInt({ message: 'The lower lesson id must be an integer' })
  @IsPositive({ message: 'The lower lesson id must be a positive integer' })
  public lowerLessonId: number;

  @ApiProperty({ required: false })
  @ValidateIf((o: UpdateLessonPositionDto) => o.lowerLessonId !== undefined)
  @IsInt({ message: 'The lower lesson position must be an integer' })
  @IsPositive({
    message: 'The lower lesson position must be a positive integer',
  })
  public lowerLessonPosition: number;
}
