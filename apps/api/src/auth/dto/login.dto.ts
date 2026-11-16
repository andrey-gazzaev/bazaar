import { IsEmail, IsString, MinLength } from 'class-validator';

/** Email and password for an existing account. */
export class LoginDto {
  /** Email stored in lowercase. */
  @IsEmail({}, { message: 'Нужен корректный email' })
  public email!: string;

  /** Plain password. */
  @IsString()
  @MinLength(1, { message: 'Введите пароль' })
  public password!: string;
}
