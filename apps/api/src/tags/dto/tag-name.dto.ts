import { IsString, MaxLength, MinLength } from 'class-validator';

/** Name of a tag an admin creates or renames. */
export class TagNameDto {
  /** Unique label. */
  @IsString()
  @MinLength(2, { message: 'Название тега должно быть не короче 2 символов' })
  @MaxLength(40, { message: 'Название тега слишком длинное' })
  public name!: string;
}
