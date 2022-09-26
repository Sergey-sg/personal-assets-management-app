import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';
import { MESSAGES, REGEX } from 'src/common/constants/regexp';

export class CreateUserDto {
  @ApiProperty({
    example: 'John',
    description: 'User name',
  })
  @IsString()
  readonly firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User surname',
  })
  @IsString()
  readonly lastName: string;

  @ApiProperty({ example: 'test@gmail.com', description: 'User email' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'Pass1234',
    description: 'User password',
  })
  @MinLength(6, { message: 'The password must be longer than 6 characters' })
  @Matches(REGEX.PASSWORD_RULE, {
    message: MESSAGES.PASSWORD_RULE_MESSAGE,
  })
  @IsString()
  readonly password: string;
}
