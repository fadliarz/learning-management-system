import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { IsValidMechEngEmail } from '../../../../../../../common/common-domain/decorator/IsValidMechEngEmail';
import { ApiProperty } from '@nestjs/swagger';

export default class SignInDto {
  @ApiProperty({
    example: '13121140@mahasiswa.itb.ac.id',
  })
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email must not be empty' })
  @IsValidMechEngEmail()
  public email: string;

  @ApiProperty({
    example: 'securePassword123',
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password must not be empty' })
  @MaxLength(64, { message: 'Password must not be longer than 64 characters' })
  public password: string;
}
