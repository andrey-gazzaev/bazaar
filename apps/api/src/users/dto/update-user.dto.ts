import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

/** Fields an admin may change. Absent fields stay as they are. */
export class UpdateUserDto {
  /** New email. Absent when the email stays. */
  @IsOptional()
  @IsEmail({}, { message: 'Нужен корректный email' })
  public email?: string;

  /** New password. Absent when the password stays. */
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Пароль должен быть не короче 8 символов' })
  @MaxLength(72, { message: 'Пароль слишком длинный' })
  public password?: string;

  /** New display name. Absent when the name stays. */
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Имя должно быть не короче 2 символов' })
  @MaxLength(60, { message: 'Имя слишком длинное' })
  public name?: string;

  /** New role. Absent when the role stays. */
  @IsOptional()
  @IsEnum(Role, { message: 'Неизвестная роль' })
  public role?: Role;
}
