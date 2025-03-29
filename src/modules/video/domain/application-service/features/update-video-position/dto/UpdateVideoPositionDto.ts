import { IsInt, IsPositive, ValidateIf } from 'class-validator';

export default class UpdateVideoPositionDto {
  @IsInt({ message: 'The arrangement version must be an integer' })
  @IsPositive({ message: 'The arrangement version must be a positive integer' })
  public version: number;

  @ValidateIf((o: UpdateVideoPositionDto) => o.lowerVideoId === undefined, {
    message: 'The upper video id or the lower video id must be provided',
  })
  @IsInt({ message: 'The upper video id must be an integer' })
  @IsPositive({ message: 'The upper video id must be a positive integer' })
  public upperVideoId: number;

  @ValidateIf((o: UpdateVideoPositionDto) => o.upperVideoId !== undefined)
  @IsInt({ message: 'The upper video position must be an integer' })
  @IsPositive({
    message: 'The upper video position must be a positive integer',
  })
  public upperVideoPosition: number;

  @ValidateIf((o: UpdateVideoPositionDto) => o.upperVideoId === undefined, {
    message: 'The upper video id or the lower video id must be provided',
  })
  @IsInt({ message: 'The lower video id must be an integer' })
  @IsPositive({ message: 'The lower video id must be a positive integer' })
  public lowerVideoId: number;

  @ValidateIf((o: UpdateVideoPositionDto) => o.lowerVideoId !== undefined)
  @IsInt({ message: 'The lower video position must be an integer' })
  @IsPositive({
    message: 'The lower video position must be a positive integer',
  })
  public lowerVideoPosition: number;
}
