import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Sign-in request. The validation rules here are the only definition: the
 * Swagger plugin copies them into the API contract (/api/docs-json), and
 * @notes/api-client turns them into the
 * Zod schema the web app's login form uses.
 */
export class LoginDto {
  @ApiProperty({ format: 'email', maxLength: 254, example: 'me@example.com' })
  @IsEmail()
  @MaxLength(254)
  email: string;

  @ApiProperty({ format: 'password', minLength: 1, maxLength: 200 })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  password: string;
}
