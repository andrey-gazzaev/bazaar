import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

/** Account an admin creates, including another admin. */
export class CreateUserDto {
  /** Email stored in lowercase. */
  @IsEmail({}, { message: 'Нужен корректный email' })
  public email!: string;

  /** Plain password, from 8 to 72 characters. */
  @IsString()
  @MinLength(8, { message: 'Пароль должен быть не короче 8 символов' })
  @MaxLength(72, { message: 'Пароль слишком длинный' })
  public password!: string;

  /** Name shown in the shop. */
  @IsString()
  @MinLength(2, { message: 'Имя должно быть не короче 2 символов' })
  @MaxLength(60, { message: 'Имя слишком длинное' })
  public name!: string;

  /** Admin, seller, or client. */
  @IsEnum(Role, { message: 'Неизвестная роль' })
  public role!: Role;
}
